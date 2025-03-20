import { AppContext } from "../database/index.js"
import { Authorization } from "./authorization.js"
import { formidable } from 'formidable'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { fileURLToPath } from 'url'
import xml2js from 'xml2js'
import dayjs from "dayjs"
import Sequelize from "sequelize"
//import axios from 'axios'

import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import { Exception } from "../utils/exception.js"

export class CalledController {

  calleds = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        const db = new AppContext()

        const search = req.body.search
        const filter = req.body.filter
        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const status = req.body.status || 'opened'

        const where = []

        if (search?.input) {

          if (search?.picker == 'number') {
            where.push({'$number$': search.input.match(/\d+/g)})
          }

          if (search?.picker == 'subject') {
            where.push({'$subject$': {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

        }

        where.push({'$company.codigo_empresa$': companyBusinessId})

        if (filter?.company) {
          where.push({'$companyId$': filter.company.id})
        }

        if (filter?.responsible) {
          where.push({'$responsibleId$': filter.responsible.id})
        }


        const whereOpened = {previsionAt: {[Sequelize.Op.gt]: Sequelize.fn('GETDATE')}}
        const whereDelayed = {previsionAt: {[Sequelize.Op.lt]: Sequelize.fn('GETDATE')}}
        const whereClosed = {closedAt: {[Sequelize.Op.not]: null}}

        if (status == 'opened') {
          where.push(whereOpened)
        }
        
        if (status == 'delayed') {
          where.push(whereDelayed)
        }

        if (status == 'closed') {
          where.push(whereClosed)
        }

        await db.transaction(async (transaction) => {

          const calleds = await db.Called.findAndCountAll({
            attributes: ['id', 'number', 'createdAt', 'previsionAt', 'closedAt', [Sequelize.literal(`CASE WHEN [called].[closedAt] IS NOT NULL THEN 'closed' WHEN [called].[previsionAt] > GETDATE() THEN 'opened' ELSE 'delayed' END`), 'status'], 'subject'],
            include: [
              {model: db.Company, as: 'company', attributes: ['id', 'surname']},
              {model: db.User, as: 'responsible', attributes: ['id', 'userName']},
              {model: db.Partner, as: 'requested', attributes: ['id', 'surname']},
              {model: db.CalledReason, as: 'reason', attributes: ['id', 'description']},
              {model: db.CalledOccurrence, as: 'occurrence', attributes: ['id', 'description']},
              {model: db.CalledResolution, as: 'resolutions', attributes: ['id', 'createdAt', 'detail'], include: [
                {model: db.User, as: 'user', attributes: ['id', 'userName']},
                {model: db.CalledStatus, as: 'status', attributes: ['id', 'description']},
              ]}
            ],
            limit: limit,
            offset: offset * limit,
            order: [['createdAt', 'desc'], [{model: db.CalledResolution, as: 'resolutions'}, 'createdAt', 'desc']],
            where,
            subQuery: false,
            distinct: true,
            transaction
          })
  
          const opened = await db.Called.count({include: [{model: db.Company, as: 'company', attributes: ['id', 'surname']}], where: [whereOpened], transaction})
          const delayed = await db.Called.count({include: [{model: db.Company, as: 'company', attributes: ['id', 'surname']}], where: [whereDelayed], transaction})
          const closed = await db.Called.count({include: [{model: db.Company, as: 'company', attributes: ['id', 'surname']}], where: [whereClosed], transaction})
  
          const statusCount = {
            opened, delayed, closed
          }
  
          res.status(200).json({
            request: {
              status, filter, limit, offset
            },
            response: {
              statusCount, rows: calleds.rows, count: calleds.count
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

  detail = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          const called = await db.Called.findOne({
            attributes: ['id', 'number', 'priority', 'step', 'externalProtocol', 'subject', 'observation'],
            include: [
              {model: db.Company, as: 'company', attributes: ['id', 'surname']},
              {model: db.Partner, as: 'requested', attributes: ['id', 'surname']},
              {model: db.CalledStatus, as: 'status', attributes: ['id', 'description']},
              {model: db.User, as: 'responsible', attributes: ['id', 'userName']},
              {model: db.Partner, as: 'requested', attributes: ['id', 'cpfCnpj', 'surname']},
              {model: db.CalledReason, as: 'reason', attributes: ['id', 'description']},
              {model: db.CalledOccurrence, as: 'occurrence', attributes: ['id', 'description']}
            ],
            where: [{id: id}],
            transaction
          })

          res.status(200).json(called)

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

        let called = {
          id: req.body.id,
          companyId: req.body.company?.id || null,
          requestedId: req.body.requested?.id || null,
          responsibleId: req.body.responsible?.id || null,
          reasonId: req.body.reason?.id || null,
          occurrenceId: req.body.occurrence?.id || null,
          priority: req.body.priority,
          step: req.body.step,
          externalProtocol: req.body.externalProtocol,
          subject: req.body.subject,
          observation: req.body.observation
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(called.id)) {

            let lastNumber = await db.query(`SELECT MAX(number) AS number FROM called INNER JOIN empresa_filial ON empresa_filial.codigo_empresa_filial = called.companyId WHERE empresa_filial.codigo_empresa = ${companyBusinessId}`, {type: Sequelize.QueryTypes.SELECT})
            
            lastNumber = parseInt(lastNumber[0]['number'])

            called = await db.Called.create({userId, number: lastNumber ? lastNumber + 1 : 1, createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), ...called}, {transaction})

          } else {
            await db.Called.update(called, {where: [{id: called.id}], transaction})
          }

          called = await db.Called.findOne({
            attributes: ['id', 'number'], include: [
              {model: db.User, as: 'responsible', attributes: ['id', 'userName']}
            ],
            where: [{id: called.id}],
            transaction
          })

          res.status(200).json(called)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  resolution = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        let resolution = {
          calledId: req.body.calledId,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          userId,
          statusId: req.body.status?.id || null,
          detail: req.body.detail
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          resolution = await db.CalledResolution.create(resolution, {transaction})

          await db.Called.update({responsibleId: req.body.responsible.id || null, statusId: resolution.statusId}, {where: [{id: req.body.calledId}], transaction})

          res.status(200).json(resolution)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  
  close = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          await db.Called.update({closedAt: dayjs().format('YYYY-MM-DD HH:mm')}, {where: [{id: req.body}], transaction})

          res.status(200).json({message: 'Fechado com sucesso!'})

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}