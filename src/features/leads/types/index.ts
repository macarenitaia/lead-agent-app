export type LeadSource = 'web' | 'whatsapp';

export interface PipelineStage {
    id: string;
    name: string;
    order_index: number;
    description?: string;
}

export interface Lead {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    source: LeadSource;
    stage_id: string;
    ai_score: number;
    ai_intent?: string;
    status: 'active' | 'archived';
    last_interaction: string;
    created_at: string;
    stage?: PipelineStage;
}

export interface AISalesBrain {
    id: string;
    lead_id: string;
    analysis: string;
    suggested_action: string;
    execution_log?: any;
    status: 'pending' | 'executed';
    created_at: string;
}
