import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { openai, EMBEDDING_MODEL } = await import('../src/lib/openai.js');

    const query = '¿Qué precisión tiene el escáner Leica?';
    console.log(`Query: ${query}`);

    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query.trim(),
    });
    const queryEmbedding = response.data[0].embedding;

    const rtdTenantId = '7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047';
    const psicofelTenantId = '612d5347-5745-4b4a-b69c-70087e6a7e8b';

    console.log('\n--- TESTING REAL TO DIGITAL TENANT ---');
    const { data: rtdResults } = await supabaseAdmin.rpc('search_knowledge_embeddings', {
        query_embedding: queryEmbedding,
        filter_tenant_id: rtdTenantId,
        match_threshold: 0.1,
        match_count: 5
    });
    console.log(`Results found for Real to Digital: ${rtdResults?.length || 0}`);
    rtdResults?.forEach(r => console.log(`- ${r.content.substring(0, 50)}...`));

    console.log('\n--- TESTING PSICOFEL TENANT (Isolation Check) ---');
    const { data: pResults } = await supabaseAdmin.rpc('search_knowledge_embeddings', {
        query_embedding: queryEmbedding,
        filter_tenant_id: psicofelTenantId,
        match_threshold: 0.1,
        match_count: 5
    });
    console.log(`Results found for Psicofel: ${pResults?.length || 0}`);
    pResults?.forEach(r => console.log(`- ${r.content.substring(0, 50)}...`));
}

main();
