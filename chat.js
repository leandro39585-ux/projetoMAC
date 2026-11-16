export default async function handler(req, res) {
  if (req.method === 'GET') {
    const providers = [];
    if (process.env.GROQ_API_KEY) providers.push('Groq');
    if (process.env.GEMINI_API_KEY) providers.push('Gemini');
    if (process.env.OPENAI_API_KEY) providers.push('OpenAI');
    return res.status(200).json({ providers });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensagens inválidas' });
  }

  // Exemplo simples com Groq / OpenAI / Gemini via variáveis de ambiente na Vercel
  try {
    if (process.env.GROQ_API_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages
        })
      });
      const d = await r.json();
      if (r.ok && d.choices?.[0]?.message?.content) {
        return res.status(200).json({ text: d.choices[0].message.content });
      }
    }

    if (process.env.OPENAI_API_KEY) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages
        })
      });
      const d = await r.json();
      if (r.ok && d.choices?.[0]?.message?.content) {
        return res.status(200).json({ text: d.choices[0].message.content });
      }
    }

    return res.status(500).json({ error: 'Nenhuma chave de IA configurada na Vercel (GROQ_API_KEY ou OPENAI_API_KEY).' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
