-- ============================================
-- SCHEMA MULTITENANT PARA REAL TO DIGITAL
-- ============================================
-- Este esquema soporta múltiples clientes (tenants) en la misma BD
-- Cada tenant tiene sus datos completamente aislados mediante RLS

-- Enable pgvector extension for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla: organizations (tenants/clientes)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Configuración específica del tenant
  settings JSONB DEFAULT '{}',
  
  -- Estado
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: conversations (historial de conversaciones)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  visitor_id TEXT NOT NULL,
  session_data JSONB DEFAULT '{}',
  odoo_lead_id INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned'))
);

-- Tabla: messages (mensajes de conversación)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Tabla: leads (información capturada de leads)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  
  -- Información de contacto
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  
  -- Cualificación
  needs TEXT,
  budget TEXT,
  urgency TEXT,
  decision_maker BOOLEAN DEFAULT FALSE,
  qualification_score INTEGER CHECK (qualification_score BETWEEN 0 AND 100),
  
  -- Estado
  stage TEXT DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'meeting_scheduled', 'converted', 'lost')),
  scheduled_meeting TIMESTAMPTZ,
  
  -- Integración Odoo
  odoo_synced BOOLEAN DEFAULT FALSE,
  odoo_lead_id INTEGER,
  odoo_sync_error TEXT,
  external_ids JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: knowledge_base (documentos para RAG por tenant)
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536), -- Dimensión de text-embedding-3-small de OpenAI
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES OPTIMIZADOS PARA MULTITENANT
-- ============================================

-- Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON public.organizations(is_active);

-- Conversations (tenant_id siempre primero en índices compuestos)
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON public.conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_visitor ON public.conversations(tenant_id, visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_status ON public.conversations(tenant_id, status);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_tenant ON public.messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_tenant_conversation ON public.messages(tenant_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_conversation ON public.leads(tenant_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_email ON public.leads(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_stage ON public.leads(tenant_id, stage);
CREATE INDEX IF NOT EXISTS idx_leads_odoo_lead_id ON public.leads(odoo_lead_id);

-- Knowledge Base
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tenant ON public.knowledge_base(tenant_id);

-- Índice vectorial para búsqueda semántica (RAG) por tenant
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON public.knowledge_base 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- FUNCIONES
-- ============================================

-- Función de búsqueda semántica POR TENANT
CREATE OR REPLACE FUNCTION search_knowledge(
  p_tenant_id UUID,
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base
  WHERE knowledge_base.tenant_id = p_tenant_id
    AND 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON public.knowledge_base
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURIDAD MULTITENANT
-- IMPORTANTE: Estas políticas permiten acceso usando service_role key
-- En producción, deberías usar autenticación de usuarios y filtrar por tenant

-- Organizations: acceso total con service_role
DROP POLICY IF EXISTS "Service role can manage organizations" ON public.organizations;
CREATE POLICY "Service role can manage organizations" 
ON public.organizations 
FOR ALL 
USING (true);

-- Conversations: filtrar por tenant_id
DROP POLICY IF EXISTS "Tenant isolation for conversations" ON public.conversations;
CREATE POLICY "Tenant isolation for conversations" 
ON public.conversations 
FOR ALL 
USING (true); -- Con service_role key, permitir todo. El filtrado se hace en app layer

-- Messages: filtrar por tenant_id
DROP POLICY IF EXISTS "Tenant isolation for messages" ON public.messages;
CREATE POLICY "Tenant isolation for messages" 
ON public.messages 
FOR ALL 
USING (true); -- Con service_role key, permitir todo. El filtrado se hace en app layer

-- Leads: filtrar por tenant_id
DROP POLICY IF EXISTS "Tenant isolation for leads" ON public.leads;
CREATE POLICY "Tenant isolation for leads" 
ON public.leads 
FOR ALL 
USING (true); -- Con service_role key, permitir todo. El filtrado se hace en app layer

-- Knowledge Base: filtrar por tenant_id
DROP POLICY IF EXISTS "Tenant isolation for knowledge_base" ON public.knowledge_base;
CREATE POLICY "Tenant isolation for knowledge_base" 
ON public.knowledge_base 
FOR ALL 
USING (true); -- Con service_role key, permitir todo. El filtrado se hace en app layer

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar organización para Real to Digital si no existe
INSERT INTO public.organizations (id, name, slug, settings, is_active)
VALUES (
  '612d5347-5745-4b4a-b69c-70087e6a7e8b',
  'Real to Digital',
  'real-to-digital',
  '{"industry": "3D", "locale": "es-ES"}',
  true
)
ON CONFLICT (id) DO NOTHING;
