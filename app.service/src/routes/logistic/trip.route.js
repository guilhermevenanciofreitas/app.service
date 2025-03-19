import { Router } from 'express'
import { LogisticTripController } from '../../controllers/logistic/trip.controller.js'
  
export class LogisticTripRoute {

    router = Router()
    controller = new LogisticTripController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/trips', async (req, res) => await this.controller.trips(req, res))
    }

}