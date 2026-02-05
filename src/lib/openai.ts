import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
    apiKey,
});

export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
