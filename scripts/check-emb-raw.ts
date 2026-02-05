import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: embs, error } = await supabase
        .from('knowledge_embeddings')
        .select('id, embedding')
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    if (embs && embs[0]) {
        const emb = typeof embs[0].embedding === 'string'
            ? JSON.parse(embs[0].embedding.replace(/{/g, '[').replace(/}/g, ']'))
            : embs[0].embedding;

        console.log(`Embedding ID: ${embs[0].id}`);
        console.log(`Dimensions: ${emb.length}`);
        console.log(`First 5 values: ${emb.slice(0, 5)}`);
    } else {
        console.log('No embeddings found.');
    }
}

main();
