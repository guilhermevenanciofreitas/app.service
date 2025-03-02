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
        this.router.post('/add-company-role', async (req, res) => await this.controller.addCompanyRole(req, res))
        this.router.post('/change-company-role', async (req, res) => await this.controller.changeCompanyRole(req, res))
        this.router.post('/remove-company-role', async (req, res) => await this.controller.removeCompanyRole(req, res))
    }

}