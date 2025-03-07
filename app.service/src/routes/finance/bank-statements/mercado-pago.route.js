import { Router } from 'express'
import { FinanceStatementMercadoPagoController } from '../../../controllers/finance/bank-statements/mercado-pago.js'
  
export class FinanceStatementBankStatementsMercadoPagoRoute {

    router = Router()
    controller = new FinanceStatementMercadoPagoController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/statements', async (req, res) => await this.controller.statements(req, res))
        this.router.post('/statement', async (req, res) => await this.controller.statement(req, res))
    }

}