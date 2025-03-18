import { Router } from 'express'
import { FinanceStatementController } from '../../controllers/finance/statement.controller.js'
  
export class FinanceStatementRoute {

    router = Router()
    controller = new FinanceStatementController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/statements', async (req, res) => await this.controller.statements(req, res))
        //this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/statement-data', async (req, res) => await this.controller.statementData(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        this.router.post('/delete', async (req, res) => await this.controller.delete(req, res))
    }

}