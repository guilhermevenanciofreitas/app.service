import express, { Router } from 'express'
import serverless from 'serverless-http'

import LoginRoute from './routes/login/login.route.js'

const app = express()

//Login
//app.use('/api/login', LoginRoute)

const router = Router()

router.get('/api/hello', (req, res) => {
  const name = req.query.name || 'Mundo'
  res.json({ message: `Olá, ${name}!` })
})

//app.use('/api', router)


//app.use(express.static('public'))

//app.get('/*', (req, res) => {
 // res.sendFile('../public/index.html')
//})

app.use('/.netlify/functions/server', router)

export const handler = serverless(app)

export { app }