import { Router } from 'express'
import { LoginController } from '../../controllers/sigin/signIn.controller.js'
  
export class LoginRoute {

    router = Router()
    controller = new LoginController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/sign-in', async (req, res) => await this.controller.signIn(req, res))
        this.router.post('/sign-out', async (req, res) => await this.controller.signOut(req, res))
    }

}