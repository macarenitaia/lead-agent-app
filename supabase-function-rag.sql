-- ============================================
-- FUNCIÓN RAG PARA KNOWLEDGE_EMBEDDINGS
-- ============================================
-- Esta función se integra con tu esquema existente
-- NO modifica ninguna tabla, solo crea la función de búsqueda

-- Eliminar función anterior si existe
DROP FUNCTION IF EXISTS search_knowledge_embeddings;

-- Crear función de búsqueda semántica POR TENANT con filtro de metadata
CREATE OR REPLACE FUNCTION search_knowledge_embeddings(
  query_embedding VECTOR(1536),
  filter_tenant_id UUID,
  metadata_filter JSONB DEFAULT '{}',
  match_threshold FLOAT DEFAULT 0.35,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity,
    knowledge_embeddings.metadata
  FROM public.knowledge_embeddings
  WHERE 
    knowledge_embeddings.tenant_id = filter_tenant_id
    AND (
      metadata_filter = '{}'::jsonb 
      OR knowledge_embeddings.metadata @> metadata_filter
    )
    AND 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Comentario de la función
COMMENT ON FUNCTION search_knowledge_embeddings IS 'Búsqueda semántica en knowledge_embeddings filtrada por tenant_id y metadata. Compatible con rag-engine.ts';
