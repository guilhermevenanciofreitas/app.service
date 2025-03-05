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

export class IntegrationController {

  integrations = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
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

        console.log(companyBusinessId)

        where.push({'$company.codigo_empresa$': companyBusinessId})

        if (filter?.company) {
          where.push({'$companyId$': filter.company.id})
        }

        if (filter?.responsible) {
          where.push({'$responsibleId$': filter.responsible.id})
        }

        const integrations = await db.CompanyIntegration.findAndCountAll({
          attributes: ['id'],
          include: [
            {model: db.Company, as: 'company', attributes: ['id', 'surname']},
            {model: db.Integration, as: 'integration', attributes: ['id', 'name']},
          ],
          limit: limit,
          offset: offset * limit,
          order: [[{model: db.Integration, as: 'integration'}, 'name', 'desc']],
          //where,
          subQuery: false
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: integrations.rows, count: integrations.count
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
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        let integration = {
          id: req.body.id,
          companyId: req.body.company?.id || null,
          integrationId: req.body.integration?.id || null
        }

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(integration.id)) {
            integration = await db.CompanyIntegration.create(integration, {transaction})
          } else {
            await db.CompanyIntegration.update(integration, {where: [{id: integration.id}], transaction})
          }

          res.status(200).json(integration)

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}