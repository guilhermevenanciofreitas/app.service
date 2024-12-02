import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import routes from './routes.js';

const app = express();

// Middleware para parsing do corpo das requisições
app.use(bodyParser.json());

// Rotas da aplicação
app.use('/.netlify/functions/server', routes);

// Servir arquivo estático
const __dirname = path.resolve();
app.use('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

export default app;