import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Using URL:', supabaseUrl);
console.log('Key prefix:', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .limit(1);

        if (error) {
            console.log('Error from Supabase API:');
            console.dir(error, { depth: null });
        } else {
            console.log('Success! Connection established.');
            console.log('Data:', data);
        }
    } catch (err) {
        console.error('Exception occurred during test:');
        console.dir(err, { depth: null });
    }
}

test();
