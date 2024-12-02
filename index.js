import express from 'express'
import { router } from './src/server.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use('/api', router)

app.listen(3000, () => {
  console.log(`Servidor rodando localmente na porta ${PORT}`)
})