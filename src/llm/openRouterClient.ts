export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenRouterClient {
  constructor(private apiKey: string, private model: string) {}

  async chat(messages: ChatMessage[]): Promise<string> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/yourrepo/ghostpad',
      'X-Title': 'Ghostpad Extension'
    };

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ model: this.model, messages })
    });

    if (!res.ok) {
      throw new Error(`OpenRouter request failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json() as any;
    return json.choices?.[0]?.message?.content ?? '';
  }
}
