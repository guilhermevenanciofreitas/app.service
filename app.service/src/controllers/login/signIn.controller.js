import { Sequelize } from "sequelize"

import { AppContext } from "../../database/index.js"

import bcrypt from 'bcrypt';

import dayjs from 'dayjs'
import { Exception } from "../../utils/exception.js"

import _ from 'lodash'

export class LoginController {

  signIn = async (req, res) => {
    try {

      const { email, password, companyBusinessId, companyId } = req.body

      if (_.isEmpty(email)) {
        res.status(201).json({message: 'Informe o e-mail!'})
        return
      }

      if (_.isEmpty(password)) {
        res.status(201).json({message: 'Informe a senha!'})
        return
      }

      const db = new AppContext()

      await db.transaction(async (transaction) => {

        const user = await db.User.findOne({
          attributes: ['id', 'name', 'email', 'passwordHash'],
          include: [
            {model: db.UserMember, as: 'userMember', attributes: ['id', 'name']}
          ],
          where: Sequelize.literal(`"User"."email" = :email OR "userMember"."UserName" = :email`),
          replacements: { email },
          transaction
        })

        if (_.isEmpty(user)) {
          res.status(201).json({message: 'Usuário não encontrado!'})
          return
        }
  
        if (!(await this.comparePassword(password, user.passwordHash))) {
          res.status(201).json({message: 'Senha incorreta!'})
          return
        }

        //if (user.status == 'inactived') {
        //  res.status(201).json({message: 'Usuário inativado!'})
        //  return
        //}

        const where = []

        where.push({'$companies.companyUsers.userId$': user.id})

        if (companyBusinessId) {
          where.push({'$companyBusiness.codigo_empresa$': companyBusinessId})
        }

        if (companyId) {
          where.push({'$companies.codigo_empresa_filial$': companyId})
        }

        const companyBusiness = await db.CompanyBusiness.findAll({
          attributes: ['id', 'description'],
          include: [
            {model: db.Company, as: 'companies', attributes: ['id', 'name', 'surname'],
              include: [
                {model: db.CompanyUser, as: 'companyUsers', attributes: ['userId']}
              ]
            },
          ],
          where,
          order: [['description', 'asc']]
        })

        if (_.size(companyBusiness) > 1) {
          res.status(202).json(companyBusiness)
          return
        }

        if (_.size(companyBusiness[0].companies) > 1) {
          res.status(203).json(companyBusiness[0].companies)
          return
        }

        const lastAcess = dayjs()
        const expireIn = 1

        await db.Session.destroy({where: { userId: user.id, [Sequelize.and]: Sequelize.literal(`DATEADD(MINUTE, expireIn, lastAcess) <= '${dayjs().format('YYYY-MM-DD HH:mm:ss')}'`)}, transaction})

        const session = await db.Session.create({companyId: companyBusiness[0].companies[0].id, userId: user.id, lastAcess: lastAcess.format('YYYY-MM-DD HH:mm:ss'), expireIn}, {transaction})

        res.status(200).json({
          message: 'Autorizado com sucesso!',
          token: session.id,
          companyBusiness: _.pick(companyBusiness[0], ['description']),
          company: _.pick(companyBusiness[0].companies[0], ['id', 'surname']),
          user: {id: user.id, name: user.userMember.name},
          lastAcess: lastAcess.format('YYYY-MM-DDTHH:mm:ss'),
          expireIn
        })

      })

    }
    catch (error) {
      Exception.error(res, error)
    }
  }

  signOut = async (req, res) => {
    try {

      if (!req.headers.authorization) {
        throw new Error('E necessário realizar o login!')
      }
  
      const db = new AppContext()

      await db.transaction(async (transaction) => {

        const session = await db.Session.findOne({attributes: ['id'], where: {id: req.headers.authorization}, transaction})

        if (session) {
          session.destroy()
        };
        
        res.status(200).json({message: 'Desconectado com sucesso!'})

      })
  
    } catch (error) {
      Exception.error(res, error)
    }
  }

  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }

}