import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- STARTING TENANT FIX MIGRATION ---');

    // 1. Create "Real to Digital" organization
    console.log('Upserting "Real to Digital" organization...');
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .upsert({
            name: 'Real to Digital',
            slug: 'real-to-digital'
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (orgError) {
        console.error('Error creating organization:', orgError);
        return;
    }

    const rtdTenantId = org.id;
    console.log(`Real to Digital Tenant ID: ${rtdTenantId}`);

    // 2. Update knowledge_embeddings
    console.log('Updating knowledge_embeddings for Real to Digital...');

    // We update records where metadata->source contains 'Real to Digital'
    // or content contains 'Real to Digital' (carefully)
    const { data: updatedEmbs, error: updateError } = await supabase
        .from('knowledge_embeddings')
        .update({ tenant_id: rtdTenantId })
        .or(`metadata->>source.ilike.%Real to Digital%,content.ilike.%Base de Conocimiento: Real to Digital%`);

    if (updateError) {
        console.error('Error updating embeddings:', updateError);
    } else {
        console.log('Knowledge embeddings updated successfully.');
    }

    // 3. Optional: Verify Psicofel Clinic still has its records
    const { count: psicofelCount } = await supabase
        .from('knowledge_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', '612d5347-5745-4b4a-b69c-70087e6a7e8b');

    console.log(`Psicofel records remaining: ${psicofelCount}`);

    const { count: rtdCount } = await supabase
        .from('knowledge_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', rtdTenantId);

    console.log(`Real to Digital records now: ${rtdCount}`);

    console.log('--- MIGRATION FINISHED ---');
}

main();
