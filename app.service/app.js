import express, { Router } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from "url"

import { LoginRoute } from './src/routes/sigin/sigin.route.js'

import { TaskRoute } from './src/routes/task/task.route.js'
import { CteRoute } from './src/routes/logistic/cte.route.js'
import { LogisticShippimentRoute } from './src/routes/logistic/shippiment.route.js'
import { SearchRoute } from './src/routes/search.js'
import { CalledRoute } from './src/routes/called.route.js'
import { SettingRoleRoute } from './src/routes/setting/role.route.js'
import { SettingUserRoute } from './src/routes/setting/user.route.js'
import { IntegrationRoute } from './src/routes/integration.route.js'

export class App {

  express = express()

  constructor() {
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializePublic()
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

    //Login
    this.express.use('/api/login', new LoginRoute().router)

    //Called
    this.express.use('/api/called', new CalledRoute().router)

    //Logistic
    this.express.use('/api/logistic/cte', new CteRoute().router)
    this.express.use('/api/logistic/shippiment', new LogisticShippimentRoute().router)

    this.express.use('/api/task', new TaskRoute().router)

    this.express.use('/api/integration', new IntegrationRoute().router)

    //Setting
    this.express.use('/api/setting/role', new SettingRoleRoute().router)
    this.express.use('/api/setting/user', new SettingUserRoute().router)

    
    this.express.use('/api/search', new SearchRoute().router)

  }

  initializePublic = () => {

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    this.express.use(express.static(path.join(__dirname, "public")))

    this.express.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"))
    })

  }

  listen = (port) => {
    this.express.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

//tasks()

//taskEmitter.on('taskUpdated', tasks)