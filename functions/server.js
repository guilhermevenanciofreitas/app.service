const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

// Rotas
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao Express com Netlify!' });
});

router.get('/api/hello', (req, res) => {
  const name = req.query.name || 'Mundo';
  res.json({ message: `Olá, ${name}!` });
});

app.use('/.netlify/functions/server', router);

// Exportar para Netlify
module.exports.handler = serverless(app);
