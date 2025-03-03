import { AppContext } from "../../database/index.js"
import { Exception } from "../../utils/exception.js"
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class SettingRoleController {

  async roles(req, res) {
    Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = []

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const roles = await db.Role.findAndCountAll({
          attributes: ['id', 'name'],
          limit: limit,
          offset: offset * limit,
          order: [['name', 'asc']],
          where
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: roles.rows, count: roles.count
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
    Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        const role = await db.Role.findOne({
          attributes: ['id', 'name'],
          include: [
            {model: db.RoleRule, as: 'roleRules', attributes: ['ruleId']}
          ],
          where: [{id}]
        })

        res.status(200).json(role)

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  async submit(req, res) {
    Authorization.verify(req, res).then(async () => {
      try {

        let role = req.body

        const roleRules = [...role.roleRules]

        const db = new AppContext()

        await db.transaction(async (transaction) => {

          if (_.isEmpty(role.id)) {
            role = await db.Role.create(role, {transaction})
          } else {
            await db.Role.update(role, {where: [{id: role.id}], transaction})
            await db.RoleRule.destroy({where: [{roleId: role.id}], transaction})
          }

          for (const roleRule of roleRules) {
            await db.RoleRule.create({roleId: role.id, ruleId: roleRule.ruleId}, {transaction})
          }

        })

        res.status(200).json(role)

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}