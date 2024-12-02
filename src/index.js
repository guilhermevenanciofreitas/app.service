import express, { Router } from 'express'
import serverless from 'serverless-http'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const router = Router()

router.get('/hello', (req, res) => {
  const name = req.query.name || 'Mundo'
  res.json({ message: `Olá, ${name}!` })
})

app.use('/api', router)

app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

export const handler = serverless(app)

export { app }