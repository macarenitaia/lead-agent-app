import { openai, EMBEDDING_MODEL } from './openai';
import { supabase, supabaseAdmin, KnowledgeEmbedding } from './supabase';

export interface SearchResult {
    id: string;
    content: string;
    similarity: number;
    metadata?: any;
}

/**
 * Genera un embedding vectorial para un texto usando OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text.trim(),
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
}

/**
 * Busca contenido relevante en la base de conocimiento usando búsqueda semántica
 * Nota: Debe existir una función RPC 'search_knowledge_embeddings' en Supabase
 */
export async function searchKnowledge(
    query: string,
    tenantId: string,
    metadataFilter: Record<string, any> = {},
    matchThreshold: number = 0.35, // Umbral bajado para mayor cobertura inicial
    matchCount: number = 5
): Promise<SearchResult[]> {
    try {
        const queryEmbedding = await generateEmbedding(query);

        // Llamar a RPC con filtro de metadatos
        const { data, error } = await supabase.rpc('search_knowledge_embeddings', {
            query_embedding: queryEmbedding,
            filter_tenant_id: tenantId,
            metadata_filter: metadataFilter,
            match_threshold: matchThreshold,
            match_count: matchCount,
        });

        if (error) {
            console.error('Error searching knowledge embeddings:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('RAG search error:', error);
        return [];
    }
}

/**
 * Añade un documento a la base de conocimiento con su embedding
 */
export async function addToKnowledgeBase(
    content: string,
    tenantId: string,
    metadata: Record<string, any> = {}
): Promise<string | null> {
    try {
        const embedding = await generateEmbedding(content);

        const { data, error } = await supabaseAdmin
            .from('knowledge_embeddings')
            .insert({
                content,
                tenant_id: tenantId,
                metadata,
                embedding,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error adding to knowledge_embeddings:', error);
            throw error;
        }

        return data?.id || null;
    } catch (error) {
        console.error('Error in addToKnowledgeBase:', error);
        return null;
    }
}

export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += ' ' + sentence;
        }
    }

    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

export async function ingestDocument(
    content: string,
    tenantId: string,
    metadata: Record<string, any> = {}
): Promise<number> {
    const chunks = chunkText(content);
    let successCount = 0;

    for (let i = 0; i < chunks.length; i++) {
        const chunkMetadata = {
            ...metadata,
            chunk_index: i,
            total_chunks: chunks.length,
        };

        const id = await addToKnowledgeBase(chunks[i], tenantId, chunkMetadata);
        if (id) successCount++;
    }

    return successCount;
}
