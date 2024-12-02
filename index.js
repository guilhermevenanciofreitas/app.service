import express from 'express'
import { router } from './functions/server.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Servidor rodando localmente na porta ${PORT}`)
})