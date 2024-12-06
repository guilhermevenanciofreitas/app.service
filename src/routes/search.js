import { Router } from 'express'
import { SearchController } from '../controllers/search.js'
  
export class SearchRoute {

    router = Router()
    controller = new SearchController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/sender', async (req, res) => await this.controller.sender(req, res))
    }

}