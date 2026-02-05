import * as dotenv from 'dotenv';
import path from 'path';

// Load config before anything else
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log('Fetching dependencies...');

    // Dynamic import of createClient to use service role key here
    const { createClient } = await import('@supabase/supabase-js');
    const { ingestDocument } = await import('../src/lib/rag-engine.js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase Service Role credentials in .env.local');
        return;
    }

    // Create a service role client to bypass RLS for ingestion
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching tenant_id...');

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai')) {
        console.error('ERROR: OPENAI_API_KEY is not set correctly in .env.local.');
        return;
    }

    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'real-to-digital')
        .single();

    if (orgError) {
        console.error('Error fetching organization "real-to-digital":', orgError.message);
        console.log('Ensure you ran scripts/fix-tenants.ts first.');
        return;
    }

    const tenantId = org.id;
    console.log(`Using tenantId: ${tenantId} (Real to Digital)`);

    const knowledgeBaseContent = `
Base de Conocimiento: Real to Digital

## 1. Identidad y Contacto
Empresa: Real to Digital.
Especialidades: Escaneado 3D, Modelado 3D (Levantamientos), Planimetría, Impresión 3D e Ingeniería Inversa.
Disponibilidad: Inmediata (24/7, 365 días al año).
Ubicación Principal: Sabadell (Barcelona), con capacidad de desplazamiento.
Canales de Conversión (Call to Action):
Email: hello@realtodigital3d.com
Teléfono: 649 446 299
Objetivo del Chatbot: Dirigir siempre al usuario a solicitar presupuesto vía email o formulario.

## 2. Servicio de Levantamientos 3D (Arquitectura y Construcción)
Tecnología: Escáner Leica RTC 360.
Precisión: Entorno a 2 mm en nubes de puntos de arquitectura.
Flujo de Trabajo:
Escaneado 3D (Generación de nube de puntos).
Modelado en Revit (Viviendas, fábricas, oficinas, etc.).
Nivel de Detalle: Estándar LOD 200 (ampliable según necesidad).
Generación de Planimetría 2D (seccionado de modelo).
Entregables:
Formatos 3D: RVT, IFC, SKP, DWG, STEP.
Formatos 2D: DWG y PDF maquetados.
Valor Añadido: Visor Leica Truview gratuito (visita virtual, medición sobre fotos, anotaciones).

Tarifas de Referencia (PVP + IVA):
Piso (~100 m²): 1.800€ (incluye nube, modelo y planos).
Villa (~200 m² + parcela): 2.500€ aprox.
Nave Industrial (4.000 m² alta complejidad): Hasta 12.000€.
Solo Nube de Puntos: 1.400€/día.

Nota: Precios especiales para clientes nuevos y habituales.
Requisitos para Presupuesto: Referencia catastral, dirección y elementos a modelar (arquitectura, instalaciones, perímetros, etc.). Presupuesto en <24h.

## 3. Ingeniería Inversa y Metrología
Enfoque: Piezas y componentes (generalmente < 3 m3).
Tecnología: Escáner de mano (pistola portátil) de alta definición.
Proceso:
Captura de malla técnica (STL).
Reconstrucción geométrica para generar un modelo CAD paramétrico, simple y editable.
Entregables: Formato STEP (completamente editable).
Servicios Adicionales: Análisis comparativo, control de deformaciones, modificaciones de diseño y creación de modelos desde cero.

Tarifa de Referencia: Ingeniería inversa de un molde de botella: ~350€.
Logística: Recepción de piezas por mensajería en Sabadell o desplazamiento in situ (con coste adicional).
Tiempo de entrega: Menos de 5 días.

## 4. Impresión 3D
Tecnologías: FDM (filamento), Resina, SLS, MJF (HP).
Materiales: Poliamidas, plásticos técnicos, metales, resinas, etc.
Criterios de Precio: Tecnología utilizada, horas de impresión, volumen y material.

## 5. Venta de Equipos y Formación
Distribución: Equipos de la marca Scantech (metrología) y equipos de largo alcance (arquitectura).
Servicios para Empresas: Venta de hardware, implementación de disciplina de ingeniería inversa y formación técnica en software especializado como PolyWorks.
`;

    console.log('Ingesting Real to Digital knowledge base...');
    try {
        // Note: ingestDocument uses the default supabase client which might fail if it's imported inside RAG engine.
        // Let's modify RAG engine to accept an optional client or just use the service role client in the engine for writes.

        // For now, let's just run it and see. If ingestDocument internally uses 'supabase' from '../src/lib/supabase.js'
        // it will use the anon client. We should fix the RAG engine to use service role if available for writes.

        const chunks = await ingestDocument(knowledgeBaseContent, tenantId, { source: 'Real to Digital KB' });
        console.log(`Successfully ingested ${chunks} chunks.`);
    } catch (err) {
        console.error('Ingestion failed:', err);
    }
}

main();
