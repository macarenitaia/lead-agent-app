import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { openai, EMBEDDING_MODEL } = await import('../src/lib/openai.js');
    const query = '¿Qué precisión tiene el escáner Leica?';
    console.log(`Query: ${query}`);

    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query.trim(),
    });
    const queryEmbedding = response.data[0].embedding;

    console.log('--- ALL KNOWLEDGE EMBEDDINGS SIMILARITY ---');
    const { data: embs, error } = await supabase
        .from('knowledge_embeddings')
        .select('id, tenant_id, content, metadata, embedding');

    if (error) {
        console.error(error);
        return;
    }

    const results = embs.map(e => {
        // Handle embedding being returned as a string by pgvector/supabase-js
        const embArr = typeof e.embedding === 'string'
            ? JSON.parse(e.embedding.replace(/{/g, '[').replace(/}/g, ']'))
            : e.embedding;

        if (!Array.isArray(embArr)) {
            return { id: e.id, similarity: '0', error: 'Invalid embedding format' };
        }

        const similarity = embArr.reduce((acc: number, val: number, i: number) => acc + val * queryEmbedding[i], 0);
        return {
            id: e.id,
            tenant_id: e.tenant_id,
            source: e.metadata?.source || e.metadata?.type || 'N/A',
            similarity: similarity.toFixed(4),
            contentSnippet: e.content.substring(0, 50)
        };
    });

    results.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));
    results.forEach((r, i) => {
        console.log(`[${i}] Similarity: ${r.similarity}, Tenant: ${r.tenant_id}, Source: ${r.source}, Content: ${r.contentSnippet}...`);
    });
}

main();
