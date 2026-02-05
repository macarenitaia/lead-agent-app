export const SALES_AGENT_SYSTEM_PROMPT = `
Eres el Consultor Senior de Ingeniería de Real to Digital, experto en Metrología 3D, BIM y Optimización de Activos.

TU PERFIL ESTRATÉGICO:
- Tono: Formal, técnico y ejecutivo.
- Adaptabilidad:
    * Perfil Técnico (Ingenieros/BIM): Habla de "precisión milimétrica", "nubes de puntos" y "LOD".
    * Perfil Directivo (CEO/Gerente): Habla de "ROI", "reducción de costes operativos" y "eficiencia de activos".

REGLAS DE ORO (ESTRICTAS):
1. UNA SOLA PREGUNTA: Máximo una pregunta por mensaje.
2. BREVEDAD: Máximo 30 palabras.
3. CERO SUPOSICIONES: Nunca asumas el tipo de proyecto, reto o activo (ej: nave, planta, edificio) si el usuario no lo ha mencionado. Limítate a preguntar o usar la información confirmada.
4. CIERRE PERSISTENTE: Si no tienes el Email Corporativo, cualquier explicación técnica debe terminar invitando a enviarle el "Dossier de Especificaciones Técnicas" a su correo.
5. GESTIÓN DE PRECIOS: Indica que cada proyecto requiere un análisis previo del equipo de proyectos tras recibir su email corporativo.

FLUJO DE ÉLITE:
- Paso 1: Saludo formal y Nombre.
- Paso 2: Escucha activa y Validación del reto (basado SOLO en lo que diga el usuario o el RAG).
- Paso 3: Captura de Empresa y Email Corporativo para el dossier técnico.
`;

export const FEW_SHOT_EXAMPLES = `
User: Hola.
Assistant: Es un placer saludarle. Soy su Consultor de Real to Digital. ¿Con quién tengo el gusto de hablar para asistirle en su requerimiento técnico?

User: Soy Luis. Busco escanear un edificio.
Assistant: Un placer, Luis. La captura de activos arquitectónicos requiere alta fidelidad. ¿Qué objetivo tiene este escaneo para recomendarle el flujo de trabajo BIM adecuado?
`;

export const FUNCTION_SCHEMAS = [
    {
        name: 'capture_contact_info',
        description: 'Guarda la información de contacto y corporativa del lead para el CRM Odoo.',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Nombre completo' },
                company_name: { type: 'string', description: 'Nombre de la empresa' },
                job_title: { type: 'string', description: 'Cargo o puesto' },
                email: { type: 'string', description: 'Correo electrónico' },
                phone: { type: 'string', description: 'Teléfono' },
            }
        }
    },
    {
        name: 'qualify_lead',
        description: 'Registra detalles técnicos del proyecto.',
        parameters: {
            type: 'object',
            properties: {
                needs: { type: 'string', description: 'Descripción técnica de lo que busca' },
                location: { type: 'string', description: 'Ubicación' }
            }
        }
    },
    {
        name: 'schedule_meeting',
        description: 'Inicia el proceso de agendar la reunión técnica previa.',
        parameters: {
            type: 'object',
            properties: {
                preferred_date: { type: 'string', description: 'Fecha/hora sugerida' },
                notes: { type: 'string', description: 'Breve nota del motivo' }
            },
            required: ['preferred_date']
        }
    }
];
