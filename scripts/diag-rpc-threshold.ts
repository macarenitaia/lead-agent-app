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
    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query.trim(),
    });
    const queryEmbedding = response.data[0].embedding;

    const rtdTenantId = '7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047';

    console.log('--- RPC TEST WITH THRESHOLD -1 ---');
    const { data, error } = await supabaseAdmin.rpc('search_knowledge_embeddings', {
        query_embedding: queryEmbedding,
        filter_tenant_id: rtdTenantId,
        match_threshold: -1,
        match_count: 5
    });

    if (error) console.error(error);
    else {
        console.log(`Results found: ${data.length}`);
        data.forEach((r: any) => console.log(`- ID: ${r.id}, Similarity: ${r.similarity}`));
    }
}

main();
