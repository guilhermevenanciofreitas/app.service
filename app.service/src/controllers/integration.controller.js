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
          attributes: ['id', 'options'],
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

  submit = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyBusinessId, companyId, userId}) => {
      try {

        res.status(200).json(req.body)

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
            await db.CompanyIntegration.update({options: JSON.stringify(req.body.options)}, {where: [{id: req.body.id}], transaction})
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