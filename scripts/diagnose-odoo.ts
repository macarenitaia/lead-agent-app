import * as dotenv from 'dotenv';
import path from 'path';

// Load config before anything else
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║         DIAGNÓSTICO DE INTEGRACIÓN ODOO - REAL TO DIGITAL     ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // ==========================================
    // PASO 1: Verificar Variables de Entorno
    // ==========================================
    console.log('📋 PASO 1: Verificando Variables de Entorno\n');

    const odooUrl = process.env.ODOO_URL;
    const odooDb = process.env.ODOO_DB;
    const odooUsername = process.env.ODOO_USERNAME;
    const odooPassword = process.env.ODOO_PASSWORD;

    console.log(`   ODOO_URL:      ${odooUrl || '❌ NO CONFIGURADO'}`);
    console.log(`   ODOO_DB:       ${odooDb || '❌ NO CONFIGURADO'}`);
    console.log(`   ODOO_USERNAME: ${odooUsername || '❌ NO CONFIGURADO'}`);
    console.log(`   ODOO_PASSWORD: ${odooPassword ? '✅ Configurado (oculto)' : '❌ NO CONFIGURADO'}\n`);

    if (!odooUrl || !odooDb || !odooUsername || !odooPassword) {
        console.error('❌ ERROR: Faltan variables de entorno obligatorias.');
        console.log('\n📝 SOLUCIÓN:');
        console.log('   1. Edita el archivo .env.local en la raíz del proyecto');
        console.log('   2. Completa las siguientes variables:');
        console.log('      ODOO_URL=https://tu-empresa.odoo.com');
        console.log('      ODOO_DB=nombre_base_datos');
        console.log('      ODOO_USERNAME=tu_email@ejemplo.com');
        console.log('      ODOO_PASSWORD=tu_contraseña');
        return;
    }

    // ==========================================
    // PASO 2: Validar Formato de URL
    // ==========================================
    console.log('🔍 PASO 2: Validando Formato de URL\n');

    if (odooUrl.endsWith('/odoo')) {
        console.log('   ⚠️  ADVERTENCIA: Tu URL termina en /odoo');
        console.log('   📝 El código automáticamente la limpiará a:', odooUrl.replace(/\/odoo$/, ''));
    } else {
        console.log('   ✅ Formato de URL correcto');
    }

    if (!odooUrl.startsWith('https://') && !odooUrl.startsWith('http://')) {
        console.log('   ❌ ERROR: La URL debe empezar con https:// o http://');
        return;
    }

    console.log('   URL final que se usará:', odooUrl.replace(/\/odoo$/, ''), '\n');

    // ==========================================
    // PASO 3: Importar y Probar Cliente Odoo
    // ==========================================
    console.log('🔌 PASO 3: Probando Conexión con Odoo\n');

    try {
        const { odooClient } = await import('../src/lib/odoo-client.js');

        if (!odooClient.isConfigured()) {
            console.error('   ❌ ERROR: El cliente de Odoo indica que no está configurado correctamente.');
            return;
        }

        console.log('   ✅ Cliente de Odoo inicializado correctamente\n');

        // ==========================================
        // PASO 4: Intentar Crear Lead de Prueba
        // ==========================================
        console.log('🧪 PASO 4: Creando Lead de Prueba\n');

        const testLead = {
            name: `Test Lead - Diagnóstico ${new Date().toLocaleString('es-ES')}`,
            email: 'diagnostico@realtodigital.com',
            phone: '+34 649 446 299',
            description: `
🤖 Lead de prueba generado automáticamente por el script de diagnóstico.

Timestamp: ${new Date().toISOString()}
Usuario sistema: ${odooUsername}
Base de datos: ${odooDb}

Si ves este lead en tu CRM de Odoo, significa que la integración está funcionando correctamente.
            `.trim()
        };

        console.log('   🚀 Enviando lead a Odoo...');
        console.log(`   📧 Email: ${testLead.email}`);
        console.log(`   📛 Nombre: ${testLead.name}\n`);

        const leadId = await odooClient.createLead(testLead);

        if (leadId) {
            console.log('   ╔════════════════════════════════════════════════════╗');
            console.log('   ║  ✅ ¡ÉXITO! La integración está funcionando      ║');
            console.log('   ╚════════════════════════════════════════════════════╝');
            console.log(`\n   🎯 Lead creado en Odoo con ID: ${leadId}`);
            console.log(`\n   📍 Puedes verificarlo en tu CRM de Odoo buscando:`);
            console.log(`      - ID: ${leadId}`);
            console.log(`      - Email: ${testLead.email}`);
            console.log(`      - Nombre: ${testLead.name}\n`);
        } else {
            console.log('   ❌ ERROR: No se pudo crear el lead en Odoo');
            console.log('\n   🔎 POSIBLES CAUSAS:');
            console.log('      1. Credenciales incorrectas (usuario/contraseña)');
            console.log('      2. Base de datos incorrecta');
            console.log('      3. Usuario sin permisos de CRM en Odoo');
            console.log('      4. URL de Odoo incorrecta');
            console.log('      5. Firewall bloqueando la conexión\n');
        }

    } catch (error: any) {
        console.log('   ╔════════════════════════════════════════════════════╗');
        console.log('   ║  ❌ ERROR DE CONEXIÓN                             ║');
        console.log('   ╚════════════════════════════════════════════════════╝\n');

        console.error('   Detalles del error:\n');

        if (error.code === 'ENOTFOUND') {
            console.log('   🔴 No se pudo resolver el dominio de Odoo');
            console.log('   📝 Verifica que la URL sea correcta:', odooUrl);
        } else if (error.code === 'ECONNREFUSED') {
            console.log('   🔴 Conexión rechazada por el servidor');
            console.log('   📝 Verifica que la URL y puerto sean correctos');
        } else if (error.message?.includes('Invalid credentials')) {
            console.log('   🔴 Credenciales inválidas');
            console.log('   📝 Verifica:');
            console.log('      - Usuario: ' + odooUsername);
            console.log('      - Base de datos: ' + odooDb);
            console.log('      - Contraseña (asegúrate que sea correcta)');
        } else {
            console.log('   Mensaje:', error.message || 'Error desconocido');
            console.log('\n   Detalles completos:');
            console.dir(error, { depth: null });
        }

        console.log('\n   💡 NOTA IMPORTANTE:');
        console.log('   El email configurado en Odoo para recibir correos NO afecta esta integración.');
        console.log('   Esta integración usa XML-RPC, que requiere:');
        console.log('   - Email del USUARIO de Odoo (para login)');
        console.log('   - Contraseña de ese usuario');
        console.log('   - Que ese usuario tenga permisos de CRM\n');
    }

    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📌 RESUMEN:');
    console.log('   - Si ves "✅ ¡ÉXITO!", la integración funciona correctamente');
    console.log('   - Si hay errores, revisa las soluciones sugeridas arriba');
    console.log('   - Para más ayuda, revisa el README.md del proyecto\n');
}

main();
