import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- APPLYING SQL FIX ---');

    const sql = `
        ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Enable all access for now" ON public.knowledge_embeddings;
        CREATE POLICY "Enable all access for now" ON public.knowledge_embeddings FOR ALL USING (true);
        
        -- Also ensure the function is accessible to anon
        GRANT EXECUTE ON FUNCTION search_knowledge_embeddings TO anon;
        GRANT SELECT ON public.knowledge_embeddings TO anon;
    `;

    // Testing if 'exec_sql' exists (common in some setups, but unlikely in production)
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (rpcError) {
        console.error('RPC exec_sql failed:', rpcError.message);
        console.log('\n--- MANUAL ACTION REQUIRED ---');
        console.log('Please run the following SQL in the Supabase Dashboard SQL Editor:');
        console.log(sql);
    } else {
        console.log('SQL applied successfully!');
    }
}

main();
