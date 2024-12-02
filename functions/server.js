import express, { Router } from 'express'
import serverless from 'serverless-http'

const app = express()
const router = Router()

// Rotas
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao Express com Netlify!' })
})

router.get('/api/hello', (req, res) => {
  const name = req.query.name || 'Mundo'
  res.json({ message: `Olá, ${name}!` })
})

app.use('/.netlify/functions/server', router)

// Exportar para Netlify
const _router = router

export { _router as router }
export const handler = serverless(app)
