NOTCHBOX - Pronto para Vercel
=============================

1. Estrutura incluída neste ZIP:
   - index.html            -> O teu notchbox.html convertido para entrada principal da Vercel, já com os botões (⏮ ⏯ ⏭) na barra e ganchos para Spotify/YouTube.
   - manifest.webmanifest  -> Manifesto PWA para instalar no telemóvel/PC.
   - vercel.json           -> Configuração de rotas da Vercel.
   - api/chat.js           -> Serverless Function da Vercel para a IA (/api/chat). Basta adicionares GROQ_API_KEY ou OPENAI_API_KEY nas Environment Variables da Vercel.
   - extensao-chrome/      -> Pasta opcional com a base da extensão Chrome (Manifest V3) para ler Spotify Web e YouTube no browser e enviar para a barra.

2. Como publicar na Vercel:
   - Extrai este ZIP para uma pasta.
   - Faz upload para um repositório GitHub (ou usa `npx vercel` na pasta).
   - Nas definições do projeto na Vercel (Settings > Environment Variables), adiciona `GROQ_API_KEY` (grátis em console.groq.com) ou `OPENAI_API_KEY`.
