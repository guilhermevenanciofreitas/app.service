import { AppContext } from "../../database/index.js"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'
import { Sequelize } from "sequelize"
import { Exception } from "../../utils/exception.js"

export class LogisticShippimentController {

  async shippiments(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const search = req.body.search

        const where = []

        if (search?.input) {

          if (search?.picker == 'code') {
            where.push({codigo_carga: search.input.match(/\d+/g)})
          }

          if (search?.picker == 'documentTransport') {
            where.push({documento_transporte: {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

        }

        await db.transaction(async (transaction) => {

          const shippiments = await db.Shippiment.findAndCountAll({
            attributes: ['id', 'documentNumber'],
            include: [
              {model: db.Partner, as: 'sender', attributes: ['id', 'surname']},
              {model: db.Cte, as: 'ctes', attributes: ['id', 'chCTe']},
            ],
            limit: limit,
            offset: offset * limit,
            order: [['departureDate', 'desc']],
            where,
            subQuery: false,
            transaction
          })
  
          res.status(200).json({
            request: {
              limit, offset
            },
            response: {
              rows: shippiments.rows, count: shippiments.count
            }
          })
  
        })
      
      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  async detail(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const shippiment = await db.Shippiment.findOne({
            attributes: ['id', 'documento_transporte', 'proPred'],
            include: [
              {model: db.Partner, as: 'sender', attributes: ['id', 'cpfCnpj', 'name']}
            ],
            where: [{codigo_carga: id}],
            transaction
          })

          res.status(200).json(shippiment)
          
        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  async addCte(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          //const cte = await db.Cte.findOne({attributes: ['id'], where: [{chaveCt: req.body.chaveCt}], transaction})

          /*
          const cteNfe = await db.CteNfe.findOne({attributes: ['id'], where: [{IDCte: req.body.cteId, IDNota: nfe.id}], transaction})

          if (cteNfe) {
            res.status(201).json({message: 'Conhecimento já está incluída!'})
            return
          }

          if (!nfe) {

          }
          */

          await db.Cte.update({shippimentId: req.body.shippimentId}, {where: [{chaveCt: req.body.chaveCt}], transaction})
          
          res.status(200).json({})

        })


      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  async submit(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        let shippiment = {
          id: req.body.id,
          tripId: 1,
          documentNumber: req.body.documento_transporte,
          senderId: req.body.sender?.id,
          proPred: req.body.proPred,
          quantity: 0,
          weight: 0,
          shippingValue: 0,
          departureDate: dayjs().format('YYYY-MM-DD HH:mm')
        }

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          if (_.isEmpty(shippiment.id)) {
            shippiment = await db.Shippiment.create(shippiment, {transaction})
          } else {
            await db.Shippiment.update(shippiment, {where: [{codigo_carga: shippiment.id}], transaction})
          }

        })

        res.status(200).json(shippiment)

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}