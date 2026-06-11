const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function pausar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarInfo(tema) {
  await pausar(800);
  return `Resultado sobre "${tema}"
acesse https://developer.mozilla.org/${tema}
ou https://nodejs.org para mais detalhes.
Contato: suporte@${tema.toLowerCase()}.com`;
}

app.get('/api/buscar/:tema', async (req, res) => {
  try {
    const resultado = await buscarInfo(req.params.tema);
    res.json({ sucesso: true, texto: resultado });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

app.post('/api/links', (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ erro: 'Envie um campo "texto"' });
  }

  const regex = /https?:\/\/[^\s,]+/g;
  const links = texto.match(regex) || [];

  res.json({ total: links.length, links });
});

app.post('/api/emails', (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ erro: 'Envie um campo "texto"' });
  }

  const regex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const emails = [];

  for (const match of texto.matchAll(regex)) {
    emails.push({
      completo: match[0],
      usuario: match[1],
      dominio: match[2]
    });
  }

  res.json({ total: emails.length, emails });
});

app.get('/api/validar', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ erro: 'Parâmetro "email" obrigatório' });
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valido = regex.test(email);

  res.json({ email, valido });
});

app.listen(PORT, () => {
  console.log(`\nServidor rodando em: http://localhost:${PORT}\n`);
});
