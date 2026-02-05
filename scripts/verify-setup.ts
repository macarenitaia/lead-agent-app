import * as dotenv from 'dotenv';
import path from 'path';

// Load config
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║     VERIFICACIÓN COMPLETA DEL SETUP - REAL TO DIGITAL        ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    let allGood = true;

    // ==========================================
    // PASO 1: Verificar Variables de Entorno
    // ==========================================
    console.log('📋 PASO 1: Verificando Variables de Entorno\n');

    const requiredEnvVars = {
        'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
        'ODOO_URL': process.env.ODOO_URL,
        'ODOO_DB': process.env.ODOO_DB,
        'ODOO_USERNAME': process.env.ODOO_USERNAME,
        'ODOO_PASSWORD': process.env.ODOO_PASSWORD,
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value || value.includes('your_') || value.includes('example.com')) {
            console.log(`   ❌ ${key}: NO CONFIGURADO`);
            allGood = false;
        } else {
            const displayValue = key.includes('KEY') || key.includes('PASSWORD')
                ? '✅ Configurado (oculto)'
                : value;
            console.log(`   ✅ ${key}: ${displayValue}`);
        }
    }

    console.log();

    if (!allGood) {
        console.log('❌ Hay variables de entorno faltantes. Por favor configúralas en .env.local\n');
        return;
    }

    // ==========================================
    // PASO 2: Verificar Conexión con Supabase
    // ==========================================
    console.log('🗄️  PASO 2: Verificando Conexión con Supabase\n');

    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verificar conexión listando tablas
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('count')
            .limit(1);

        if (error) {
            console.log('   ⚠️  No se pudo conectar a la tabla knowledge_base');
            console.log('   📝 Error:', error.message);
            console.log('\n   💡 ACCIÓN REQUERIDA:');
            console.log('   1. Ve a tu Dashboard de Supabase');
            console.log('   2. Ve a SQL Editor');
            console.log('   3. Ejecuta el script: supabase-schema.sql\n');
            allGood = false;
        } else {
            console.log('   ✅ Conexión con Supabase exitosa');
            console.log('   ✅ Tabla knowledge_base existe\n');
        }
    } catch (error: any) {
        console.log('   ❌ Error al conectar con Supabase:', error.message);
        allGood = false;
    }

    // ==========================================
    // PASO 3: Verificar OpenAI
    // ==========================================
    console.log('🤖 PASO 3: Verificando API de OpenAI\n');

    try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Test simple: listar modelos
        const models = await openai.models.list();
        console.log('   ✅ Conexión con OpenAI exitosa');
        console.log('   ✅ API Key válida\n');
    } catch (error: any) {
        console.log('   ❌ Error al conectar con OpenAI:', error.message);
        console.log('   📝 Verifica que tu API Key sea válida\n');
        allGood = false;
    }

    // ==========================================
    // PASO 4: Verificar Odoo
    // ==========================================
    console.log('🔌 PASO 4: Verificando Conexión con Odoo\n');

    try {
        const { odooClient } = await import('../src/lib/odoo-client.js');

        if (!odooClient.isConfigured()) {
            console.log('   ❌ Cliente de Odoo no configurado\n');
            allGood = false;
        } else {
            // Intentar autenticar
            const testLead = {
                name: 'Test - Verificación Setup',
                email: 'verificacion@realtodigital.com',
                phone: '+34 600 000 000',
                description: 'Lead de prueba para verificar setup'
            };

            const leadId = await odooClient.createLead(testLead);

            if (leadId) {
                console.log('   ✅ Conexión con Odoo exitosa');
                console.log('   ✅ Lead de prueba creado con ID:', leadId, '\n');
            } else {
                console.log('   ❌ No se pudo crear lead en Odoo\n');
                allGood = false;
            }
        }
    } catch (error: any) {
        console.log('   ❌ Error al conectar con Odoo:', error.message, '\n');
        allGood = false;
    }

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (allGood) {
        console.log('   ╔════════════════════════════════════════════════════╗');
        console.log('   ║  ✅ ¡TODO CONFIGURADO CORRECTAMENTE!              ║');
        console.log('   ╚════════════════════════════════════════════════════╝\n');
        console.log('   🚀 Próximos pasos:');
        console.log('   1. Cargar base de conocimiento: npm run ingest:kb');
        console.log('   2. Iniciar servidor: npm run dev');
        console.log('   3. Abrir: http://localhost:3000\n');
    } else {
        console.log('   ⚠️  HAY PROBLEMAS DE CONFIGURACIÓN');
        console.log('   📝 Revisa los errores arriba y corrígelos\n');
    }
}

main();
