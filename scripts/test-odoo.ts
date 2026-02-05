import * as dotenv from 'dotenv';
import path from 'path';

// Load config before anything else
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log('Fetching Odoo dependency...');
    const { odooClient } = await import('../src/lib/odoo-client.js');

    console.log('Testing Odoo connection...');
    console.log('URL:', process.env.ODOO_URL);
    console.log('DB:', process.env.ODOO_DB);
    console.log('User:', process.env.ODOO_USERNAME);

    if (!odooClient.isConfigured()) {
        console.error('Odoo is not correctly configured in .env.local');
        return;
    }

    try {
        const testLead = {
            name: 'Test Lead [Antigravity]',
            email: 'test@example.com',
            description: 'Prueba de conexión desde el Agente IA de Captura de Leads.'
        };

        console.log('Attempting to create a test lead in Odoo...');
        const leadId = await odooClient.createLead(testLead);

        if (leadId) {
            console.log('SUCCESS! Odoo Lead ID:', leadId);
        } else {
            console.error('FAILED to create lead. Check credentials and URL.');
        }
    } catch (err) {
        console.error('Odoo Test Exception:');
        console.dir(err, { depth: null });
    }
}

main();
