import { Router } from 'express'
import { SettingUserController } from '../../controllers/setting/user.controller.js'

export class SettingUserRoute {

    router = Router()
    controller = new SettingUserController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/users', async (req, res) => await this.controller.users(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
    }

}