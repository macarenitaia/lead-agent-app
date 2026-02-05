import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║         INSPECCIÓN DE ESQUEMA SUPABASE EXISTENTE             ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('📋 Inspeccionando tablas existentes...\n');

    // Intentar listar tablas manualmente
    const tablesArray = [
        'organizations',
        'conversations',
        'messages',
        'leads',
        'knowledge_base',
        'knowledge_embeddings',
        'specialists',
        'appointments',
        'patients'
    ];

    for (const tableName of tablesArray) {
        const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

        if (!error) {
            console.log(`✅ ${tableName} - ${count || 0} registros`);

            // Obtener una fila para ver estructura
            const { data: sample } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);

            if (sample && sample.length > 0) {
                const columns = Object.keys(sample[0]);
                console.log(`   Columnas: ${columns.join(', ')}`);

                // Verificar si tiene tenant_id
                if (columns.includes('tenant_id')) {
                    console.log(`   ✅ Tiene tenant_id (multitenant)`);
                } else {
                    console.log(`   ⚠️  NO tiene tenant_id`);
                }
            }
            console.log();
        }
    }

    // Verificar organizaciones existentes
    console.log('🏢 Organizaciones (tenants) existentes:\n');
    const { data: orgs } = await supabase
        .from('organizations')
        .select('id, name, slug, is_active')
        .order('created_at', { ascending: false });

    if (orgs) {
        orgs.forEach(org => {
            console.log(`   - ${org.name} (${org.slug})`);
            console.log(`     ID: ${org.id}`);
            console.log(`     Activo: ${org.is_active ? 'Sí' : 'No'}\n`);
        });
    }

    // Verificar tenant_id de Real to Digital
    const RTD_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;
    console.log('🎯 Tenant ID de Real to Digital configurado:\n');
    console.log(`   ${RTD_TENANT_ID}\n`);

    const { data: rtdOrg } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', RTD_TENANT_ID)
        .single();

    if (rtdOrg) {
        console.log('   ✅ Real to Digital existe en organizations');
        console.log(`   Nombre: ${rtdOrg.name}`);
        console.log(`   Slug: ${rtdOrg.slug}\n`);
    } else {
        console.log('   ⚠️  Real to Digital NO existe en organizations');
        console.log('   📝 Necesitas insertarlo manualmente\n');
    }

    // Verificar knowledge base
    console.log('📚 Base de Conocimiento:\n');

    // Intentar knowledge_embeddings
    const { data: kb2, count: kbCount2, error: kbError } = await supabase
        .from('knowledge_embeddings')
        .select('*', { count: 'exact', head: true });

    if (!kbError && kbCount2 !== null) {
        console.log(`   ✅ Tabla knowledge_embeddings existe (${kbCount2} registros totales)`);

        // Ver si tiene datos de Real to Digital
        const { count: rtdKB } = await supabase
            .from('knowledge_embeddings')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', RTD_TENANT_ID);

        console.log(`   📊 Registros de Real to Digital: ${rtdKB || 0}`);

        // Ver tenants únicos en knowledge_embeddings
        const { data: uniqueTenants } = await supabase
            .from('knowledge_embeddings')
            .select('tenant_id')
            .limit(1000);

        if (uniqueTenants) {
            const tenantIds = [...new Set(uniqueTenants.map(d => d.tenant_id))];
            console.log(`   📊 Número de tenants con datos: ${tenantIds.length}\n`);
        }
    } else {
        console.log('   ⚠️  Tabla knowledge_embeddings NO existe\n');
    }

    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📌 CONCLUSIÓN:\n');
    console.log('   El esquema ya existe. Revisa si necesitas:');
    console.log('   1. Insertar Real to Digital en organizations');
    console.log('   2. Adaptar el código para usar knowledge_embeddings');
    console.log('   3. Migrar datos si es necesario\n');
}

main().catch(console.error);
