import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- CHECKING RLS POLICIES ---');

    // Check if RLS is enabled
    const { data: rls, error: rlsError } = await supabase.rpc('get_table_rls_status', { table_name: 'knowledge_embeddings' });
    if (rlsError) {
        console.log('Fallback: Checking RLS via information_schema (if possible)');
    } else {
        console.log(`RLS enabled for knowledge_embeddings: ${rls}`);
    }

    // List policies
    const { data: policies, error: polError } = await supabase
        .from('pg_policies' as any)
        .select('*')
        .eq('tablename', 'knowledge_embeddings');

    if (polError) {
        console.log('Could not list policies directly. Trying to test with anon client...');
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const anonClient = createClient(supabaseUrl, anonKey);

        const { count, error: anonError } = await anonClient
            .from('knowledge_embeddings')
            .select('*', { count: 'exact', head: true });

        if (anonError) {
            console.error('Anon client error:', anonError.message);
        } else {
            console.log(`Anon client can see ${count} records.`);
        }
    } else {
        console.table(policies);
    }
}

main();
