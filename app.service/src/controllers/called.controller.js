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
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        const db = new AppContext()

        const search = req.body.search
        const filter = req.body.filter
        const limit = req.body.limit || 50
        const offset = req.body.offset || 0

        const where = []

        if (search?.input) {

          if (search?.picker == 'number') {
            where.push({'$number$': search.input.match(/\d+/g)})
          }

          if (search?.picker == 'subject') {
            where.push({'$subject$': {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

        }

        if (filter?.company) {
          where.push({'companyId': filter.company.id})
        }

        if (filter?.responsible) {
          where.push({'responsibleId': filter.responsible.id})
        }

        const calleds = await db.Called.findAndCountAll({
          attributes: ['id', 'number', 'createdAt', 'subject'],
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
          subQuery: false
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: calleds.rows, count: calleds.count
          }
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
            attributes: ['id', 'number', 'subject'],
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
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {
      try {

        let called = {
          id: req.body.id,
          companyId: req.body.company?.id || null,
          requestedId: req.body.requested?.id || null,
          responsibleId: req.body.responsible?.id || null,
          reasonId: req.body.reason?.id || null,
          occurrenceId: req.body.occurrence?.id || null,
          subject: req.body.subject
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(called.id)) {
            const lastNumber = await db.Called.max('number', {transaction})
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

}