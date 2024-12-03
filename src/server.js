import express, { Router } from 'express'
import serverless from 'serverless-http'

import LoginRoute from './routes/login/login.route.js'

class App {

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  initializeMiddlewares() {
    this.app.use(express.json())
  }

  initializeRoutes() {

    this.app.get('/*', (req, res) => {
      res.sendFile('../public/index.html')
    })

    this.app.use('/api/login', LoginRoute)

  }

  listen(port) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

export const app = new App()

export const handler = serverless(app)