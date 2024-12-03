import express, { Router } from 'express'
import serverless from 'serverless-http'

import LoginRoute from './routes/login/login.route.js'

const app = express()

//Login
app.use('/api/login', LoginRoute)




app.use(express.static('public'))

app.get('/*', (req, res) => {
  res.sendFile('../public/index.html')
})

export const handler = serverless(app)

export { app }