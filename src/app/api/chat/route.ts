import { NextRequest, NextResponse } from 'next/server';
import { openai, CHAT_MODEL } from '@/lib/openai';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { searchKnowledge } from '@/lib/rag-engine';
import { odooClient } from '@/lib/odoo-client';
import {
    SALES_AGENT_SYSTEM_PROMPT,
    FEW_SHOT_EXAMPLES,
    FUNCTION_SCHEMAS,
} from '@/lib/prompts/sales-agent';

interface ChatRequest {
    message: string;
    leadId?: string;
    tenantId: string;
}

export async function POST(req: NextRequest) {
    try {
        const { message, leadId, tenantId }: ChatRequest = await req.json();

        if (!message || !tenantId) {
            return NextResponse.json(
                { error: 'Missing required fields: message, tenantId' },
                { status: 400 }
            );
        }

        // 1. Obtener o crear lead (usamos supabaseAdmin para bypass RLS si es necesario)
        let currentLeadId = leadId;

        if (!currentLeadId) {
            const { data: newLead, error } = await supabaseAdmin
                .from('leads')
                .insert({
                    tenant_id: tenantId,
                    status: 'new'
                })
                .select('id')
                .single();

            if (error || !newLead) {
                console.error('Error creating lead:', error);
                throw new Error('Failed to create lead/session');
            }

            currentLeadId = newLead.id;
        }

        // 2. Guardar mensaje del usuario
        await supabaseAdmin.from('messages').insert({
            lead_id: currentLeadId,
            role: 'user',
            content: message,
            tenant_id: tenantId
        });

        // 3. Buscar contexto relevante en la base de conocimiento (RAG)
        // Umbral bajado a 0.4 para mayor receptividad
        const relevantContext = await searchKnowledge(
            message,
            tenantId,
            { source: 'Real to Digital KB' },
            0.4,
            3
        );

        const contextText = relevantContext.length > 0
            ? `\n\nCONTEXTO DE LA BASE DE CONOCIMIENTO (Usa esto para responder):\n${relevantContext
                .map((r: any) => `- ${r.content}`)
                .join('\n')}`
            : '';

        // 4. Obtener historial de conversación
        const { data: messageHistory } = await supabase
            .from('messages')
            .select('role, content')
            .eq('lead_id', currentLeadId)
            .order('created_at', { ascending: true })
            .limit(20);

        // 5. Construir mensajes para OpenAI
        const chatMessages: any[] = [
            {
                role: 'system',
                content: SALES_AGENT_SYSTEM_PROMPT + '\n\n' + FEW_SHOT_EXAMPLES + contextText,
            },
            ...(messageHistory || []).map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
        ];

        // 6. Llamar a OpenAI con function calling
        const completion = await openai.chat.completions.create({
            model: CHAT_MODEL,
            messages: chatMessages,
            functions: FUNCTION_SCHEMAS,
            function_call: 'auto',
            temperature: 0.5,
            max_tokens: 300,
        });

        const assistantMessage = completion.choices[0].message;
        const functionCall = assistantMessage.function_call;

        // 7. Procesar function calls si existen y obtener respuesta final
        let responseContent = assistantMessage.content;

        if (functionCall) {
            const functionResult = await handleFunctionCall(
                functionCall.name,
                JSON.parse(functionCall.arguments || '{}'),
                currentLeadId as string,
                tenantId
            );

            // Si no hay contenido, forzamos una respuesta natural de confirmación
            if (!responseContent) {
                const secondCompletion = await openai.chat.completions.create({
                    model: CHAT_MODEL,
                    messages: [
                        ...chatMessages,
                        assistantMessage,
                        {
                            role: 'function',
                            name: functionCall.name,
                            content: JSON.stringify(functionResult || { status: 'success' })
                        }
                    ],
                    max_tokens: 50,
                });
                responseContent = secondCompletion.choices[0].message.content;
            }
        }

        if (!responseContent) {
            responseContent = '¡Entendido! ¿En qué más puedo ayudarte?';
        }

        // 8. Guardar respuesta del asistente e iniciar sincronizaciones en paralelo (sin bloquear respuesta final)
        const saveAssistantMsg = supabaseAdmin.from('messages').insert({
            lead_id: currentLeadId,
            role: 'assistant',
            content: responseContent,
            tenant_id: tenantId,
            pnl_analysis: functionCall ? { function_called: functionCall.name } : null,
        });

        // 9. Responder al cliente lo antes posible
        // No esperamos a que se guarde el mensaje en la DB para responder, 
        // ejecutamos la respuesta mientras la DB se actualiza.

        // Creamos la promesa de respuesta pero no la bloqueamos con Odoo si podemos
        const responseData = {
            message: responseContent,
            leadId: currentLeadId,
            functionCalled: functionCall?.name || null,
        };

        // Aseguramos que el mensaje se guarde antes de terminar la ejecución de la función
        await saveAssistantMsg;

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error('CHAT_API_ERROR_DETAIL:', {
            message: error.message,
            stack: error.stack,
            error
        });
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Maneja las llamadas a funciones del agente
 */
async function handleFunctionCall(
    functionName: string,
    args: any,
    leadId: string,
    tenantId: string
): Promise<any> {
    switch (functionName) {
        case 'capture_contact_info':
            return await captureContactInfo(args, leadId, tenantId);

        case 'qualify_lead':
            return await qualifyLead(args, leadId);

        case 'schedule_meeting':
            return await scheduleMeeting(args, leadId as string);

        default:
            console.warn(`Unknown function: ${functionName}`);
            return { error: 'Unknown function' };
    }
}

/**
 * Captura información de contacto del lead
 */
async function captureContactInfo(data: any, leadId: string, tenantId: string): Promise<any> {
    try {
        const { data: updatedLead, error } = await supabaseAdmin
            .from('leads')
            .update({
                name: data.name || undefined,
                company: data.company_name || data.company || undefined,
                job_title: data.job_title || data.role || undefined,
                email: data.email || undefined,
                phone: data.phone || undefined,
                status: data.email ? 'contacted' : 'new',
            })
            .eq('id', leadId)
            .select()
            .single();

        if (error) throw error;

        if (updatedLead && odooClient.isConfigured()) {
            try {
                console.log('DEBUG_ODOO: Iniciando creación de lead/opportunity...');
                const odooLeadId = await odooClient.createLead({
                    name: updatedLead.name || 'Lead desde chat',
                    company: updatedLead.company,
                    job_title: updatedLead.job_title,
                    email: updatedLead.email,
                    phone: updatedLead.phone,
                    description: `Lead capturado desde chat web.
Lead Local ID: ${leadId}`,
                });

                if (odooLeadId) {
                    await supabaseAdmin
                        .from('leads')
                        .update({
                            external_ids: { odoo_id: odooLeadId },
                            odoo_synced: true
                        })
                        .eq('id', leadId);
                    console.log('DEBUG_ODOO: Sync exitosa:', odooLeadId);
                } else {
                    console.error('DEBUG_ODOO: Odoo no devolvió ID');
                }
            } catch (e) {
                console.error('DEBUG_ODOO_ERROR:', e);
            }
        }

        return { status: 'success', captured: Object.keys(data), info: "Lead updated successfully in local database" };
    } catch (error) {
        console.error('Error capturing contact info:', error);
        return { status: 'error', message: 'Failed to capture info' };
    }
}

/**
 * Cualifica al lead con la información recopilada
 */
async function qualifyLead(data: any, leadId: string): Promise<any> {
    try {
        // Calcular score de cualificación (0-100)
        let score = 50;

        if (data.budget === '>50k') score += 30;
        else if (data.budget === '20k-50k') score += 20;
        else if (data.budget === '5k-20k') score += 10;

        if (data.urgency === 'inmediata') score += 20;

        // Actualizar lead en Supabase
        const { data: lead } = await supabaseAdmin
            .from('leads')
            .update({
                interests: [data.needs],
                interest_score: Math.min(score, 100),
                status: score >= 70 ? 'qualified' : 'contacted',
            })
            .eq('id', leadId)
            .select('external_ids, name, email')
            .single();

        // Sincronizar actualización con Odoo
        if (lead?.external_ids?.odoo_id && odooClient.isConfigured()) {
            const odooId = lead.external_ids.odoo_id;
            const description = `
[ACTUALIZACIÓN CUALIFICACIÓN]
Necesidad: ${data.needs}
Presupuesto: ${data.budget}
Urgencia: ${data.urgency}
Score IA: ${Math.min(score, 100)}/100
            `.trim();

            // Si el score es alto, podrías moverlo de etapa, pero por ahora solo enriquecemos la descripción
            await odooClient.updateLead(odooId, { description });
        }

        return { status: 'success', score };
    } catch (error) {
        console.error('Error qualifying lead:', error);
        return { status: 'error' };
    }
}

/**
 * Agenda una reunión con el lead
 */
async function scheduleMeeting(data: any, leadId: string): Promise<any> {
    try {
        const meetingDate = new Date(data.preferred_date);

        // Actualizar lead con evento en el timeline
        const { data: lead } = await supabaseAdmin
            .from('leads')
            .select('timeline, external_ids')
            .eq('id', leadId)
            .single();

        const currentTimeline = lead?.timeline || [];
        const newTimeline = [...currentTimeline, {
            type: 'meeting_scheduled',
            date: meetingDate.toISOString(),
            notes: data.notes
        }];

        await supabaseAdmin
            .from('leads')
            .update({
                timeline: newTimeline,
                status: 'meeting_scheduled',
            })
            .eq('id', leadId);

        // Sincronizar cita con Odoo
        if (lead?.external_ids?.odoo_id && odooClient.isConfigured()) {
            const odooId = lead.external_ids.odoo_id;

            // Crear actividad de reunión en Odoo
            await odooClient.scheduleAppointment(
                odooId,
                meetingDate,
                `Reunión IA: ${data.notes || 'Sin notas'}`
            );

            // Actualizar descripción del lead también
            await odooClient.updateLead(odooId, {
                description: `[NUEVA REUNIÓN] Fecha: ${data.preferred_date}. Notas: ${data.notes || 'N/A'}`
            });
        }

        return { status: 'success', date: data.preferred_date };
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        return { status: 'error' };
    }
}
