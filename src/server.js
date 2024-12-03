import express, { Router } from 'express'
import cors from 'cors'
import serverless from 'serverless-http'

import { tasks } from "./task.js"
import { taskEmitter } from "./taskEvents.js"

import { LoginRoute } from './routes/login/login.route.js'

class App {

  express = express()

  constructor() {
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  initializeMiddlewares = () => {

    const corsOptions = {
      origin: '*',
      exposedHeaders: ['Last-Acess', 'Expire-In'],
    }

    this.express.use(cors(corsOptions))
    this.express.use(express.json())

  }

  initializeRoutes = () => {


    this.express.use('/api/login', new LoginRoute().router)

    //this.express.get('/*', (req, res) => res.sendFile('../public/index.html'))

  }

  listen = (port) => {
    this.express.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

//tasks()

//taskEmitter.on('taskUpdated', tasks)

export const app = new App()

export const handler = serverless(app.express)