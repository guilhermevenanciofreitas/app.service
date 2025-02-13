import { Sequelize } from "sequelize"

import { AppContext } from "../../database/index.js"

import crypto from 'crypto';

import dayjs from 'dayjs'
import { Exception } from "../../utils/exception.js"

import _ from 'lodash'

export class LoginController {

  signIn = async (req, res) => {
    try {

      const { email, password, companyId } = req.body

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
          attributes: ['id', 'email', 'password', 'passwordSalt'],
          /*include: [
            {model: db.CompanyUser, as: 'companyUsers', attributes: ['id'], include: [
              {model: db.Company, as: 'company', attributes: ['id', 'name']}
            ]}
          ],*/
          where: [{email}], transaction});

        if (_.isEmpty(user)) {
          res.status(201).json({message: 'Usuário não encontrado!'})
          return
        }
  
        const r = await this.compare(password, 'tv4oO/Nj4s9a04xG5WPvKA==')

        console.log(r)

        if (!_.isEqual(user.password, password)) {
          res.status(201).json({message: 'Senha incorreta!'})
          return
        }

        if (user.status == 'inactived') {
          res.status(201).json({message: 'Usuário inativado!'})
          return
        }

        let companies = _.map(user.companyUsers, (c) => c.company)

        if (!_.isEmpty(companyId)) {
          companies = _.filter(companies, (c) => c.id == companyId)
        }

        if (_.size(companies) > 1) {
          res.status(202).json(companies)
          return
        }

        const company = companies[0]

        const lastAcess = dayjs()
        const expireIn = 120

        await db.Session.destroy({where: [{userId: user.id, [Sequelize.and]: Sequelize.literal(`"lastAcess" + ("expireIn" ||' minutes')::interval <= '${dayjs().format('YYYY-MM-DD HH:mm:ss')}'`)}], transaction})

        const session = await db.Session.create({companyId: company.id, userId: user.id, lastAcess: lastAcess.format('YYYY-MM-DD HH:mm:ss'), expireIn}, {transaction})

        res.status(200).json({
          message: 'Autorizado com sucesso!',
          token: session.id,
          company: _.pick(company, ['id', 'name', 'surname']),
          user: _.pick(user, ['id', 'name']),
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

  compare = async (password, salt) => {

    const iterations = 10000;
    const keyLength = 256 / 8; // 256 bits
    const digest = 'sha1'; // HMACSHA1

    // Converte o salt de base64 para buffer
    const saltBuffer = Buffer.from(salt, 'utf8');
    const passwordBuffer = Buffer.from(password, 'utf8');
    
    const senhaCriptografada = crypto.pbkdf2Sync(passwordBuffer, saltBuffer, iterations, keyLength, digest);
    return senhaCriptografada.toString('base64');
    
  }

}