import { Router } from 'express'
import { ExpeditionDispatchController } from '../../controllers/expedition/dispatch.controller.js'
  
export class ExpeditionDispatchRoute {

    router = Router()
    controller = new ExpeditionDispatchController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/dispatches', async (req, res) => await this.controller.dispatches(req, res))
    }

}