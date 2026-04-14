export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set' });
    }

    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

    const geminiResponse = await fetch(geminiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      return res.status(geminiResponse.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
