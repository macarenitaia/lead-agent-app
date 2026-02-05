const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error('Missing env vars');
        return;
    }

    const supabase = createClient(url, key);

    console.log('--- DIAGNÓSTICO DE TABLA LEADS ---');

    // Ver columnas
    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .limit(1);

    if (leadError) {
        console.error('Error:', leadError);
    } else if (lead && lead.length > 0) {
        console.log('Columnas encontradas:', Object.keys(lead[0]));
        console.log('Valores ejemplo:', JSON.stringify(lead[0], null, 2));
    } else {
        console.log('No leads found.');
    }
}

run();
