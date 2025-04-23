import { Router } from 'express'
import { FinancePaymentController } from '../../controllers/finance/payment.controller.js'

export class FinancePaymentRoute {

    router = Router()
    controller = new FinancePaymentController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/payments', async (req, res) => await this.controller.payments(req, res))
        //this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        //this.router.post('/statement-data', async (req, res) => await this.controller.statementData(req, res))
        //this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        //this.router.post('/delete', async (req, res) => await this.controller.delete(req, res))
    }

}