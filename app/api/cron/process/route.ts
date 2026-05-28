import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const apiKey = process.env.FIREWORKS_API_KEY ?? '';
const fireworks = createOpenAI({
  apiKey,
  baseURL: 'https://api.fireworks.ai/inference/v1',
});

export const maxDuration = 30;

/*
kimi-k2p5
kimi-k2p6
glm-5p1
gpt-oss-120b
flux-1-dev-fp8
flux-1-schnell-fp8
flux-kontext-pro
deepseek-v4-pro
flux-kontext-max
*/
const model = fireworks.chat('accounts/fireworks/models/gpt-oss-120b');

export async function GET() {
  try {
    const messages = [
      { role: 'user' as const, content: 'What is the second highest peak in the world?' }
    ];
    const result = streamText({
      model,
      messages,
      allowSystemInMessages: true, 
      onFinish(res) {
        console.log(res.text);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
