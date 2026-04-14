module.exports = async function handler(req, res) {
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
    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY environment variable is not set' });
    }

    const { messages, systemPrompt } = req.body;

    const safeMessages = Array.isArray(messages) ? messages : [];
    const safeSystemPrompt = (typeof systemPrompt === 'string' && systemPrompt.trim().length > 0)
      ? systemPrompt.trim()
      : 'You are a helpful AI assistant for Aisam Nurbin portfolio website.';

    console.log('systemPrompt received:', safeSystemPrompt ? 'YES' : 'MISSING');
    console.log('messages count:', safeMessages.length);

    const groqMessages = [
      { role: 'system', content: safeSystemPrompt },
      ...safeMessages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: error.message });
  }
};
