import { AppContext } from "../../database/index.js"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class LogisticShippimentController {

  async shippiments(req, res) {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        //const bankAccount = req.body.bankAccount

        //const whereCompany = {'$bankAccount.companyId$': company.id}

        //const where = []

        //where.push(whereCompany)

        //if (bankAccount) {
        //  where.push({bankAccountId: bankAccount.id})
        //}

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const shippiments = await db.Shippiment.findAndCountAll({
          attributes: ['id', 'documento_transporte', 'peso', 'valor_frete'],
          include: [
            {model: db.Partner, as: 'sender', attributes: ['id', 'surname']},
          ],
          limit: limit,
          offset: offset * limit,
          order: [['id', 'desc']],
          //where,
        })

        /*
        const bankAccounts = await db.BankAccount.findAll({
          attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit', [Sequelize.literal(`(SELECT COALESCE(SUM("amount"), 0) FROM "bankAccountStatement" WHERE "bankAccountStatement"."bankAccountId" = "bankAccount"."id")`), 'balance']],
          include: [
            {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
          ],
          where: [whereCompany]
        })
        */

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: shippiments.rows, count: shippiments.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

}