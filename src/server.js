import express, { Router } from 'express'
import serverless from 'serverless-http'

const app = express()
const router = Router()

router.get('/hello', (req, res) => {
  const name = req.query.name || 'Mundo'
  res.json({ message: `Olá, ${name}!` })
})

app.use('/api', router)

export { app }

export const handler = serverless(app)