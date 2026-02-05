import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- ORGANIZATIONS ---');
    const { data: orgs, error: orgError } = await supabase.from('organizations').select('*');
    if (orgError) console.error('Error fetching orgs:', orgError);
    else {
        orgs.forEach(o => {
            console.log(`Org ID: ${o.id}, Name: ${o.name}`);
        });
    }

    console.log('\n--- KNOWLEDGE EMBEDDINGS (Last 10) ---');
    const { data: embs, error: embError } = await supabase
        .from('knowledge_embeddings')
        .select('id, tenant_id, content, metadata')
        .limit(20);

    if (embError) console.error('Error fetching embeddings:', embError);
    else {
        embs.forEach(e => {
            console.log(`ID: ${e.id}, Tenant: ${e.tenant_id}, Source: ${e.metadata?.source || e.metadata?.type || 'N/A'}`);
        });
    }

    console.log('\n--- LEADS ---');
    const { data: leads, error: leadError } = await supabase.from('leads').select('id, tenant_id, name, email').limit(10);
    if (leadError) console.error('Error fetching leads:', leadError);
    else console.table(leads);

    console.log('\n--- MESSAGES ---');
    const { data: messages, error: msgError } = await supabase.from('messages').select('id, tenant_id, role, content').limit(10);
    if (msgError) console.error('Error fetching messages:', msgError);
    else console.table(messages);
}

main();
