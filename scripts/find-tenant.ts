import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('🔍 Buscando tenant de Real to Digital (empieza con 7c3)...\n');

    // Buscar en knowledge_embeddings
    const { data: kb } = await supabase
        .from('knowledge_embeddings')
        .select('tenant_id, content, metadata')
        .ilike('content', '%Real to Digital%')
        .limit(1);

    if (kb && kb.length > 0) {
        const tenantId = kb[0].tenant_id;
        console.log('✅ Tenant ID de Real to Digital encontrado:');
        console.log(`   ${tenantId}\n`);

        // Buscar en organizations
        const { data: org } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', tenantId)
            .single();

        if (org) {
            console.log('✅ Organización encontrada:');
            console.log(`   Nombre: ${org.name}`);
            console.log(`   Slug: ${org.slug}`);
            console.log(`   Activo: ${org.is_active}\n`);
        } else {
            console.log('⚠️  No encontrado en organizations\n');
        }

        // Contar registros de Real to Digital
        const { count } = await supabase
            .from('knowledge_embeddings')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId);

        console.log(`📊 Registros de Real to Digital: ${count || 0}\n`);
        console.log('═══════════════════════════════════════════════════\n');
        console.log('Actualiza tu .env.local con:');
        console.log(`NEXT_PUBLIC_TENANT_ID=${tenantId}\n`);
    } else {
        console.log('❌ No se encontraron registros de Real to Digital');
    }
}

main().catch(console.error);
