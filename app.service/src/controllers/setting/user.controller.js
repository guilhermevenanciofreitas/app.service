import { Sequelize } from "sequelize"
import { Authorization } from "../authorization.js"
import { AppContext } from "../../database/index.js"
import dayjs from 'dayjs'
import _ from 'lodash'
import { Exception } from "../../utils/exception.js"

export class SettingUserController {

  users = async (req, res) => {
    Authorization.verify(req, res).then(async ({companyId}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter // || { situation: ['active'] }

        //const status = req.body.status

        const where = [{'$companyUsers.company.companyBusiness.codigo_empresa$': 1}]

        //if (status) {
        //  where.push({'$user.status$': status})
        //}

        await db.transaction(async (transaction) => {

          const company = await db.Company.findOne({attributes: ['id'], where: [{codigo_empresa_filial: companyId}], transaction})

          //company.companyBusinessId

          const users = await db.User.findAndCountAll({
            attributes: ['id'],
            include: [
              {model: db.UserMember, as: 'userMember', attributes: ['userName']},
              {model: db.CompanyUser, as: 'companyUsers', attributes: ['id'], include: [
                {model: db.Company, as: 'company', attributes: ['id'], include: [
                  {model: db.CompanyBusiness, as: 'companyBusiness', attributes: ['id']}
                ]}
              ]},
              //{model: db.Role, as: 'role', attributes: ['id', 'name']}
            ],
            limit: limit,
            offset: offset * limit,
            where,
            //order: [['user', 'name', 'asc']],
            transaction,
            subQuery: false
          })

          /*
          const userStatus = await db.User.findAll({
            attributes: ['status', [Sequelize.literal(`COALESCE(COUNT("status"), 0)`), 'statusCount']],
            group: ['status'],
            include: [
              {model: db.CompanyUser, as: 'companyUsers', attributes: [], where: [{companyId: company.id}], required: true}
            ],
            raw: true
          })
          */

          res.status(200).json({
            request: {
              filter, limit, offset
            },
            response: {
              rows: users.rows, count: users.count
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
    Authorization.verify(req, res).then(async({company, user}) => {
      try {

        const db = new AppContext()

        let userDetail

        await db.transaction(async (transaction) => {
          
          userDetail = await db.User.findOne({
            attributes: ['id', 'name', 'email', 'status'],
            include: [
              {model: db.CompanyUser, as: 'companyUsers', attributes: ['companyId']}
            ],
            where: [{id: req.body.id}],
            transaction
          })

          const companyUsers = await db.CompanyUser.findAll({
            attributes: ['id'],
            include: [
              {model: db.Company, as: 'company', attributes: ['id', 'surname']}
            ],
            where: [{userId: user.id}]
          })

          userDetail.dataValues.companyUsers = _.map(userDetail.dataValues.companyUsers, (companyUser) => companyUser.companyId)
          userDetail.dataValues.companies = _.map(companyUsers, (companyUser) => companyUser.company)

        })
  
        res.status(200).json(userDetail.dataValues)

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  submit = async (req, res) => {
    Authorization.verify(req, res).then(async () => {
      try {

        let user = req.body

        user.inactivatedAt = user.status == 'inactivated' ? dayjs().format('YYYY-MM-DD HH:mm') : null

        const db = new AppContext()

        await db.transaction(async (transaction) => {
          
          if (_.isEmpty(user.id)) {
            await db.User.create(user, {transaction})
          } else {

            await db.User.update(user, {where: [{id: user.id}], transaction})

            if (user.inactivatedAt) await db.Session.destroy({where: [{userId: user.id}], transaction})

          }

        })

        res.status(200).json(user)

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  changePassword = async (req, res) => {
    Authorization.verify(req, res).then(async({user}) => {
      try {

        const { password, newPassword, confirmPassword } = req.body

        const db = new AppContext()

        await db.transaction().then(async (transaction) => {

          const userPassword = await db.User.findOne({attributes: ['id', 'password'], where: [{id: user.id}], transaction})

          if (newPassword != confirmPassword) {
            res.status(201).json({message: 'Confirmação de senha não confere!'})
            return
          }

          if (userPassword.password != password) {
            res.status(201).json({message: 'Senha incorreta!'})
            return
          }

          await db.User.update({password: newPassword}, {where: [{id: user.id}], transaction})

          res.status(200).json({message: 'Senha alterada com sucesso!'})

        })

      } catch (error) {
        Exception.error(res, error)
      }
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}