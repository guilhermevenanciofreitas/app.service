import { Router } from 'express'
import { IntegrationController } from '../controllers/integration.controller.js'

export class IntegrationRoute {

    router = Router()
    controller = new IntegrationController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/integrations', async (req, res) => await this.controller.integrations(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
    }

}