import { AppContext } from "../../database/index.js"
import { Authorization } from "../authorization.js"
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
import { Exception } from "../../utils/exception.js"

export class LogisticTripController {

  trips = async (req, res) => {
    await Authorization.verify(req, res).then(async ({companyId, userId}) => {

      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const search = req.body.search

        const where = []

        const trips = await db.Trip.findAndCountAll({
          attributes: ['id'],
          include: [
            {model: db.Partner, as: 'driver', attributes: ['id', 'surname']}
          ],
          limit: limit,
          offset: offset * limit,
          //order: [['dhEmi', 'desc']],
          where,
          subQuery: false
        })

        res.status(200).json({
          request: {
            limit, offset
          },
          response: {
            rows: trips.rows, count: trips.count
          }
        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}