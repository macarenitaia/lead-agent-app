import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.trim())
    .filter(line => line.includes('='));

console.log(`Found ${envVars.length} environment variables.`);

for (const envVar of envVars) {
    const [key, ...valueParts] = envVar.split('=');
    const value = valueParts.join('=');

    if (value === 'your_openai_api_key_here' || value === 'your_username' || !value) {
        console.log(`Skipping placeholder or empty value for ${key}`);
        continue;
    }

    console.log(`Adding ${key} to Vercel...`);
    try {
        // We use printf to handle special characters in values
        execSync(`vercel env add ${key} production`, {
            input: value,
            stdio: ['pipe', 'inherit', 'inherit']
        });
    } catch (error: any) {
        console.error(`Failed to add ${key}:`, error.message);
    }
}

console.log('All environment variables processed.');
