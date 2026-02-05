import * as dotenv from 'dotenv';
import path from 'path';

// Load config first
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testRAG() {
    console.log('Testing RAG search for Real to Digital...');

    // Use dynamic imports to ensure env vars are ready
    const { searchKnowledge } = await import('../src/lib/rag-engine.js');

    const query = '¿Qué precisión tiene el escáner Leica?';
    const tenantId = '7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047'; // Real to Digital
    const filter = { source: 'Real to Digital KB' };

    console.log(`Using tenantId: ${tenantId}`);
    console.log(`Using filter: ${JSON.stringify(filter)}`);

    try {
        const results = await searchKnowledge(query, tenantId, filter, 0.1);

        if (results && results.length > 0) {
            console.log('RAG Test SUCCESS! Results found:');
            results.forEach((r: any, i: number) => {
                console.log(`\nResult ${i + 1} (Similarity: ${r.similarity.toFixed(4)}):`);
                console.log(`Content: ${r.content.substring(0, 150)}...`);
                console.log(`Metadata: ${JSON.stringify(r.metadata)}`);
            });
        } else {
            console.log('RAG Test: No matching results found. Check metadata source or threshold.');
        }
    } catch (err) {
        console.error('RAG Test Failed:', err);
    }
}

testRAG();
