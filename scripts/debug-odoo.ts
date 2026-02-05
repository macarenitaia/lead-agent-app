import { odooClient } from '../src/lib/odoo-client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
// Forzar re-inicialización para que use las variables recién cargadas
odooClient.init();

async function testOdooConnection() {
    console.log('--- TEST DE CONEXIÓN ODOO ---');
    console.log('URL:', process.env.ODOO_URL);
    console.log('DB:', process.env.ODOO_DB);
    console.log('User:', process.env.ODOO_USERNAME);

    const url = process.env.ODOO_URL;
    const db = process.env.ODOO_DB;
    const user = process.env.ODOO_USERNAME;
    const pass = process.env.ODOO_PASSWORD;

    if (!url || !db || !user || !pass) {
        console.error('❌ Faltan variables de entorno cruciales:', { url: !!url, db: !!db, user: !!user, pass: !!pass });
        return;
    }

    try {
        console.log('\n1. Intentando crear un Lead de prueba...');
        const leadId = await odooClient.createLead({
            name: 'TEST DEBUG ' + new Date().toISOString(),
            email: 'test_debug@example.com',
            company: 'Empresa de Prueba',
            description: 'Lead creado desde script de diagnóstico local.'
        });

        if (leadId) {
            console.log('✅ ÉXITO: Lead creado con ID:', leadId);
        } else {
            console.log('❌ FALLO: Odoo no devolvió ID (revisa logs internos)');
        }
    } catch (error) {
        console.error('❌ ERROR FATAL DURANTE EL TEST:', error);
    }
}

testOdooConnection();
