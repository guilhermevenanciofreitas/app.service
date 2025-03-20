import { Router } from 'express'
import { CalledController } from '../controllers/called.controller.js'

export class CalledRoute {

    router = Router()
    controller = new CalledController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/calleds', async (req, res) => await this.controller.calleds(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/resolution', async (req, res) => await this.controller.resolution(req, res))
        this.router.post('/close', async (req, res) => await this.controller.close(req, res))
    }

}