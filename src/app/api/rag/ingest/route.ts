import { NextRequest, NextResponse } from 'next/server';
import { ingestDocument } from '@/lib/rag-engine';

interface IngestRequest {
    content: string;
    tenantId: string;
    metadata?: Record<string, any>;
}

/**
 * API endpoint para cargar documentos a la base de conocimiento (RAG)
 * 
 * POST /api/rag/ingest
 * Body: { content: string, tenantId: string, metadata?: object }
 */
export async function POST(req: NextRequest) {
    try {
        const { content, tenantId, metadata }: IngestRequest = await req.json();

        if (!content || !tenantId) {
            return NextResponse.json(
                { error: 'Missing required fields: content, tenantId' },
                { status: 400 }
            );
        }

        // Procesar y guardar el documento en knowledge_embeddings
        const chunksCreated = await ingestDocument(content, tenantId, metadata || {});

        return NextResponse.json({
            success: true,
            chunksCreated,
            message: `Knowledge ingested successfully in ${chunksCreated} chunks for tenant ${tenantId}`,
        });
    } catch (error) {
        console.error('RAG ingest error:', error);
        return NextResponse.json(
            { error: 'Failed to ingest document' },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint para listar documentos en la base de conocimiento
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tenantId = searchParams.get('tenantId');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!tenantId) {
            return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        const { supabase } = await import('@/lib/supabase');

        const { data, error } = await supabase
            .from('knowledge_embeddings')
            .select('id, metadata, created_at')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return NextResponse.json({
            documents: data || [],
            count: data?.length || 0,
        });
    } catch (error) {
        console.error('Error fetching knowledge embeddings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}
