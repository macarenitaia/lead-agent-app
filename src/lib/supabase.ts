import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for client-side / restricted access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side / admin access (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Types adapted to existing schema
export interface Message {
  id: string;
  created_at: string;
  lead_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  pnl_analysis?: any;
  tenant_id: string;
}

export interface Lead {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  interest_score?: number;
  lead_potential_value?: number;
  interests?: string[];
  external_ids?: Record<string, any>;
  timeline?: any[];
  admin_id?: string;
  tenant_id: string;
  assigned_specialist?: string;
  last_referral_at?: string;
}

export interface KnowledgeEmbedding {
  id: string;
  tenant_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  created_at: string;
}

export interface Organization {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  api_keys: any[];
}
