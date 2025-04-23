import { AppContext } from "../../database/index.js"
import { Authorization } from "../authorization.js"
import Sequelize from "sequelize"
import { Exception } from "../../utils/exception.js"
import _ from 'lodash'

export class ExpeditionDispatchController {

  dispatches = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {

      try {

        const db = new AppContext()

        const search = req.body.search
        const filter = req.body.filter
        const shippimentFilter = req.body.shippimentFilter
        const limit = req.body.limit || 10
        const offset = req.body.offset || 0

        const where = []

        if (search?.input) {

          if (search?.picker == 'tripTravelId') {
            where.push({IDViagem: search.input.match(/\d+/g)})
          }
  
        }

        if (filter?.driver) {
          where.push({'$IDMotorista$': filter.driver.id})
        }

        await db.transaction(async (transaction) => {

          const whereShippiment = []

          whereShippiment.push({idViagemGrupo: { [Sequelize.Op.eq]: null }})

          if (shippimentFilter?.documentNumber) {
            whereShippiment.push({documento_transporte: shippimentFilter?.documentNumber})
          }

          const shippiments = []
          /*
          const shippiments = await db.Shippiment.findAll({
            attributes: ['id', 'documentNumber'],
            include: [
              {model: db.Partner, as: 'sender', attributes: ['surname']}
            ],
            where: whereShippiment,
            limit: 50,
            order: [['id', 'desc']],
            transaction
          })
          */

          let trips = await db.Trip.findAndCountAll({
            attributes: ['id', 'tripTravelId'],
            include: [
              {model: db.Partner, as: 'driver', attributes: ['id', 'surname']},
              {model: db.Vehicle, as: 'vehicle', attributes: ['id', 'identity']},
              {model: db.Vehicle, as: 'haulage1', attributes: ['id', 'identity']},
              {model: db.Vehicle, as: 'haulage2', attributes: ['id', 'identity']},
              {model: db.Shippiment, as: 'shippiments', attributes: ['id', 'documentNumber']}
            ],
            limit: limit,
            offset: offset * limit,
            order: [['id', 'desc']],
            where,
            //subQuery: false,
            //distinct: true,
            transaction
          })

          trips.rows.unshift({id: null, shippiments})

          res.status(200).json({
            request: {
              filter, limit, offset
            },
            response: {
              trips: trips.rows, count: trips.count - 1
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

  change = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const { tripId, shippimentId } = req.body
        
        const db = new AppContext()

        await db.transaction(async (transaction) => {

          const trip = await db.Trip.findOne({attributes: ['tripTravelId'], where: [{id: tripId}], transaction})

          const ctes = await db.Cte.findAll({attributes: ['id'], where: [{IDCarga: shippimentId}], transaction})

          for (let cte of ctes) {
            await db.Cte.update({tripId: trip?.tripTravelId}, {where: [{ID: cte.id}], transaction})
          }

          await db.Shippiment.update({tripId, tripTravelId: trip?.tripTravelId}, {where: [{codigo_carga: shippimentId}], transaction})

          res.status(200).json({})

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}