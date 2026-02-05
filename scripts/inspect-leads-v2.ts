import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Importamos después de cargar dotenv
import { supabaseAdmin } from '../src/lib/supabase';

async function inspectLeadsSchema() {
    console.log('--- INSPECCIÓN DE ESQUEMA: TABLA LEADS ---');

    // Consultar una fila para ver las columnas
    const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error al consultar la tabla leads:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Columnas encontradas:', Object.keys(data[0]));
        console.log('Fila de ejemplo:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('⚠️ No hay registros en la tabla leads para inferir columnas.');
        // Intentar una inserción que falle para ver el esquema
        const { error: insertError } = await supabaseAdmin
            .from('leads')
            .insert({ x_non_existent_column_diagnose: 'test' });

        console.log('Mensaje de error de Postgres (ayuda a ver columnas):', insertError?.message);
    }
}

inspectLeadsSchema();
