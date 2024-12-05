import { Router } from 'express'
import { LogisticShippimentController } from '../../controllers/logistic/shippiment.controller.js'
import multer from 'multer'
import path from 'path'
  
export class LogisticShippimentRoute {

    router = Router()
    controller = new LogisticShippimentController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/shippiments', async (req, res) => await this.controller.shippiments(req, res))
    }

}