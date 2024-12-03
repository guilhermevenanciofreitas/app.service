import express, { Router } from 'express'
import serverless from 'serverless-http'
import { LoginRoute } from './routes/login/login.route.js'

class App {

  express = express()

  constructor() {
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  initializeMiddlewares() {
    this.express.use(express.json())
  }

  initializeRoutes() {

    this.express.use('/api/login', new LoginRoute().router)

    //this.express.get('/*', (req, res) => res.sendFile('../public/index.html'))

  }

  listen(port) {
    this.express.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

export const app = new App()

export const handler = serverless(app.express)