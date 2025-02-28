import { Router } from 'express'
import { SearchController } from '../controllers/search.js'
  
export class SearchRoute {

    router = Router()
    controller = new SearchController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/company', async (req, res) => await this.controller.company(req, res))
        this.router.post('/user', async (req, res) => await this.controller.user(req, res))
        this.router.post('/role', async (req, res) => await this.controller.role(req, res))
        this.router.post('/called-reason', async (req, res) => await this.controller.calledReason(req, res))
        this.router.post('/called-occurrence', async (req, res) => await this.controller.calledOccurrence(req, res))
        this.router.post('/called-status', async (req, res) => await this.controller.calledStatus(req, res))
        this.router.post('/partner', async (req, res) => await this.controller.partner(req, res))
        this.router.post('/city', async (req, res) => await this.controller.city(req, res))
        this.router.post('/sender', async (req, res) => await this.controller.sender(req, res))
        this.router.post('/recipient', async (req, res) => await this.controller.recipient(req, res))
        this.router.post('/cfop', async (req, res) => await this.controller.cfop(req, res))
    }

}