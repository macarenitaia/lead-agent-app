import { createClient } from '@/lib/supabase/client';
import { Lead, PipelineStage } from '../types';

const supabase = createClient();

export const leadsService = {
    async getStages(): Promise<PipelineStage[]> {
        const { data, error } = await supabase
            .from('pipeline_stages')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getLeads(): Promise<Lead[]> {
        const { data, error } = await supabase
            .from('leads')
            .select(`
        *,
        stage:pipeline_stages(*)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async updateLeadStage(leadId: string, stageId: string) {
        const { data, error } = await supabase
            .from('leads')
            .update({ stage_id: stageId, last_interaction: new Date().toISOString() })
            .eq('id', leadId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async createLead(lead: Partial<Lead>) {
        const { data, error } = await supabase
            .from('leads')
            .insert([lead])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
