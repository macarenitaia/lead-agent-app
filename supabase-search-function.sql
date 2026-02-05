-- Habilitar extensión si no existe
CREATE EXTENSION IF NOT EXISTS vector;

-- Función de búsqueda semántica optimizada con filtro de metadatos
-- Permite buscar dentro de un tenant y filtrar por un campo específico en metadata (ej: source)
CREATE OR REPLACE FUNCTION search_knowledge_embeddings(
  query_embedding VECTOR(1536),
  filter_tenant_id UUID,
  metadata_filter JSONB DEFAULT '{}',
  match_threshold FLOAT DEFAULT 0.78,
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
    k.id,
    k.content,
    1 - (k.embedding <=> query_embedding) AS similarity,
    k.metadata
  FROM public.knowledge_embeddings k
  WHERE k.tenant_id = filter_tenant_id
    -- Filtro dinámico: El registro debe contener todos los campos de metadata_filter
    AND (metadata_filter = '{}'::JSONB OR k.metadata @> metadata_filter)
    AND 1 - (k.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
