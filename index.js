const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao Express com execução local!' });
});

app.get('/api/hello', (req, res) => {
  const name = req.query.name || 'Mundo';
  res.json({ message: `Olá, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando localmente na porta ${PORT}`);
});
