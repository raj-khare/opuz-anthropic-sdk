import { Check } from './types';
import * as Core from './core';
import nodeFetch from 'node-fetch';

declare global {
    var fetch: typeof nodeFetch;
}

const fetchImpl = (typeof globalThis !== 'undefined' && 'fetch' in globalThis) ? 
    (globalThis as any).fetch.bind(globalThis) : 
    nodeFetch;

interface IRequest {
    tools: any[];
    system: string;
    messages: { role: string; content: string; }[];
}

interface ITrace {
    request: IRequest;
    response: any; // TODO: type this properly with Anthropic types
    duration: number;
    checks: Check[];
    tag?: string;
}

export default class Opuz {
    private apiKey: string;

    constructor() {
        const key = Core.readEnv('OPUZ_API_KEY') ?? null;
        if (!key) {
            throw new Error('OPUZ_API_KEY is required. Set it in the environment or pass it in the config.');
        }
        this.apiKey = key;
    }

    getUrl(): string {
        if (Core.readEnv('NODE_ENV') === 'dev') {
            return 'https://496f-49-43-179-176.ngrok-free.app/api/trace';
        }
        return 'https://496f-49-43-179-176.ngrok-free.app/api/trace';
    }

    async trace(request: ITrace) {
        console.log('Tracing request:', request);
        try {
            const response = await fetchImpl(this.getUrl(), {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            console.log('Response:', response);
        } catch (error) {
            console.error('Error tracing request:', error);
        }
    }
}
