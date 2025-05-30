import dayjs from "dayjs"
import { AppContext } from "../../database/index.js"
import { Exception } from "../../utils/exception.js"
import { Authorization } from "../authorization.js"
import _ from 'lodash'
import Sequelize from "sequelize"

export class FinanceStatementController {

  async statements(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        //const filter = req.body.filter || { situation: ['active'] }

        const where = []

        where.push({deletedAt: { [Sequelize.Op.is]: null }})

        //if (filter['situation']) where.push({situation: filter['situation']})

        const statements = await db.Statement.findAndCountAll({
          attributes: ['id', 'createdAt', 'importedAt'],
          include: [
            {model: db.Company, as: 'company', attributes: ['id', 'surname']},
            {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'agency'],
              include: [
                //{model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
              ]
            }
          ],
          limit: limit,
          offset: offset * limit,
          where,
          order: [['createdAt', 'desc']],
        });

        res.status(200).json({
          request: {
            limit, offset
          },
          response: {
            rows: statements.rows, count: statements.count
          }
        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  async detail(req, res) {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const statement = await db.Statement.findOne({
            attributes: ['id', 'begin', 'end'],
            include: [
              {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'agency']},
            ],
            where: [{id: id}],
            transaction
          })

          res.status(200).json(statement)
          
        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  statementData = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const statementData = await db.StatementData.findAll({
            attributes: ['id', 'date', 'sourceId', 'orderId', 'gross', 'fee', 'debit', 'credit', 'balance'],
            include: [
              {model: db.StatementDataConciled, as: 'concileds', attributes: ['id']},
            ],
            where: [{
              statementId: id,
              date: { [Sequelize.Op.ne]: null },
              description: { [Sequelize.Op.notIn]: ['reserve_for_debt_payment', 'reserve_for_payout'] },
              [Sequelize.Op.or]: [
                { credit: { [Sequelize.Op.gt]: 0 } },
                { debit: { [Sequelize.Op.lt]: 0 } }
              ]
            }],
            order: [['date', 'asc']],
            transaction
          })

          console.log(statementData)

          res.status(200).json({statementData})

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  submit = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        let statement = {
          id: req.body.id,
          companyId: req.body.company?.id || null,
          bankAccountId: req.body.bankAccount?.id || null,
          begin: req.body.begin,
          end: req.body.end
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(statement.id)) {
            statement = await db.Statement.create(statement, {transaction})
          //} else {
          //  await db.Statement.update(statement, {where: [{id: statement.id}], transaction})
          }

          res.status(200).json(statement)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  delete = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          await db.Statement.update({deletedAt: dayjs().format('YYYY-MM-DD HH:mm')}, {where: [{id: req.body.id}], transaction})

          res.status(200).json({message: 'Excluído com sucesso!'})

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}