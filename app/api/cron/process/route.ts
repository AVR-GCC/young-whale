export const maxDuration = 30;

export async function GET() {
  try {
    const apiKey = process.env.FIREWORKS_API_KEY ?? '';

    // CORRECTION: Targeting a verified, public serverless model asset string
    const modelId = 'accounts/fireworks/models/deepseek-v3p1';

    console.log('Sending global serverless fetch to:', modelId);

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'user', content: 'What is the second highest peak in the world?' }
        ],
        stream: false
      }),
    });

    const data = await response.json();

    console.log('--- RAW PUBLIC INFRASTRUCTURE RESPONSE ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('-----------------------------------------');

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Inference Failure', details: data }), { status: response.status });
    }

    return new Response(JSON.stringify({ text: data.choices[0]?.message?.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fatal API compilation error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
