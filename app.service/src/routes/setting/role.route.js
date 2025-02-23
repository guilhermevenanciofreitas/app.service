import { Router } from 'express'
import { SettingRoleController } from '../../controllers/setting/role.controller.js'

export class SettingRoleRoute {

    router = Router()
    controller = new SettingRoleController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/roles', async (req, res) => await this.controller.roles(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
    }

}