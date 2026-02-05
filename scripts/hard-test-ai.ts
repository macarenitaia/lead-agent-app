import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_URL = 'http://localhost:3000/api/chat';
const TENANT_ID = '7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047';

interface TestScenario {
    profile: string;
    question: string;
    expectedFocus: string;
    category: 'Technical' | 'Sales' | 'Edge Case' | 'Policy';
}

const scenarios: TestScenario[] = [
    {
        profile: 'Arquitecto BIM',
        question: '¿Qué precisión garantizáis en vuestros modelos LOD 300?',
        expectedFocus: 'Precisión milimétrica, nubes de puntos, flujos de trabajo BIM.',
        category: 'Technical'
    },
    {
        profile: 'Gerente de Planta',
        question: 'He visto vuestra web y quiero saber el precio de escanear una planta de motores.',
        expectedFocus: 'No dar precios, redirigir a consulta formal/email.',
        category: 'Policy'
    },
    {
        profile: 'Ingeniero Mecánico',
        question: '¿Trabajáis con reversión a formato SolidWorks?',
        expectedFocus: 'Ingeniería inversa, formatos nativos, precisión técnica.',
        category: 'Technical'
    },
    {
        profile: 'Curioso',
        question: '¿Podéis escanear mi cara para una impresión 3D barata?',
        expectedFocus: 'Mantener enfoque industrial/ingeniería formal.',
        category: 'Edge Case'
    },
    {
        profile: 'Inversor / CEO',
        question: '¿Cómo reduce vuestra tecnología los costes de mantenimiento?',
        expectedFocus: 'Gemelo digital, eficiencia operativa, prevención de errores.',
        category: 'Sales'
    }
];

async function runHardTest() {
    console.log('--- INICIANDO PRUEBA DE FUEGO (FETCH NATIVO) ---');
    const results = [];

    for (const scenario of scenarios) {
        console.log(`\n> Perfil: ${scenario.profile}`);
        try {
            const startTime = Date.now();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: scenario.question,
                    tenantId: TENANT_ID
                }),
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data: any = await response.json();
            const duration = Date.now() - startTime;

            results.push({
                ...scenario,
                answer: data.message,
                duration
            });
            console.log(`✓ Respuesta recibida (${duration}ms): "${data.message.substring(0, 50)}..."`);
        } catch (error: any) {
            console.error(`❌ Fallo en ${scenario.profile}:`, error.message);
        }
    }

    console.log('\n--- DATA_FINAL_BLOCK_START ---');
    console.log(JSON.stringify(results));
    console.log('--- DATA_FINAL_BLOCK_END ---');
}

runHardTest();
