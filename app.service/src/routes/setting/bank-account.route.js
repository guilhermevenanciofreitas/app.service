import { Router } from 'express'
import { SettingBankAccountController } from '../../controllers/setting/bank-account.controller.js'

export class SettingBankAccountRoute {

    router = Router()
    controller = new SettingBankAccountController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/bank-accounts', async (req, res) => await this.controller.bankAccounts(req, res))
    }

}