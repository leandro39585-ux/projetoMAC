// Função serverless da Vercel: guarda a chave da Anthropic no servidor.
// Defina ANTHROPIC_API_KEY (obrigatório) e MODEL (opcional) nas Environment Variables.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Origem não permitida' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY não está definida na Vercel' });
  const msgs = req.body && req.body.messages;
  if (!Array.isArray(msgs) || !msgs.length || msgs.length > 20 ||
      !msgs.every(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length < 6000) ||
      msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'Pedido inválido' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.MODEL || 'claude-haiku-5-5', max_tokens: 400, messages: msgs })
    });
    const d = await r.json();
    if (!r.ok) return res.status(502).json({ error: (d.error && d.error.message) || 'Erro da API' });
    res.status(200).json({ text: d.content.filter(b => b.type === 'text').map(b => b.text).join('') });
  } catch (e) { res.status(500).json({ error: 'Falha ao contactar a API' }); }
};
