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

export class LogisticCteController {

  ctes = async (req, res) => {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const search = req.body.search

        const where = []

        if (search?.input) {

          if (search?.picker == 'nCT') {
            where.push({nCT: search.input.match(/\d+/g)})
          }
  
          if (search?.picker == 'sender') {
            where.push({'$shippiment.sender.RazaoSocial$': {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

          if (search?.picker == 'chaveCt') {
            where.push({chaveCT: search.input.match(/\d+/g)})
          }

        }
        
        where.push({cStat: 100})

        const ctes = await db.Cte.findAndCountAll({
          attributes: ['id', 'dhEmi', 'nCT', 'serieCT', 'chaveCT', 'cStat', 'baseCalculo'],
          include: [
            {model: db.Partner, as: 'recipient', attributes: ['id', 'surname']},
            {model: db.Shippiment, as: 'shippiment', attributes: ['id'], include: [
              {model: db.Partner, as: 'sender', attributes: ['id', 'surname']}
            ]},
            {model: db.CteNfe, as: 'cteNfes', attributes: ['id', 'nfeId'], include: [
              {model: db.Nfe, as: 'nfe', attributes: ['id', 'chaveNf']},
            ]},
          ],
          limit: limit,
          offset: offset * limit,
          order: [['id', 'desc']],
          where,
          subQuery: false
        })

        res.status(200).json({
          request: {
            limit, offset
          },
          response: {
            rows: ctes.rows, count: ctes.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  upload = async (req, res) => {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        

        const form = formidable({});

        const archives = await form.parse(req)

        for (const file of archives[1].files) {

          await db.transaction(async (transaction) => {

            const xml = fs.readFileSync(file.filepath, 'utf8')

            const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

            const json = await parser.parseStringPromise(xml)

            let cte = await db.Cte.findOne({attributes: ['id'], where: [{chaveCT: json.cteProc.protCTe.infProt.chCTe}]})

            if (cte) {
              return
            }

            const sender = await db.Partner.findOne({attributes: ['id', 'diasPrazoPagamento'], where: [{cpfCnpj: json.cteProc.CTe.infCte.rem.CNPJ || json.cteProc.CTe.infCte.rem.CPF}], transaction})

            if (!sender) {
              throw new Error('Remetente não está cadastrado!')
            }

            let recipient = await db.Partner.findOne({where: {cpfCnpj: json.cteProc.CTe.infCte.dest.CNPJ || json.cteProc.CTe.infCte.dest.CPF}, transaction})

            if (!recipient) {

              const partner = {cpfCnpj: json.cteProc.CTe.infCte.dest.CNPJ || json.cteProc.CTe.infCte.dest.CPF, name: json.cteProc.CTe.infCte.dest.xNome, surname: json.cteProc.CTe.infCte.dest.xNome, ISDestinatario: 1, ativo: 1}

              console.log(partner)

              recipient = await db.Partner.create(partner, {transaction})

              //throw new Error('Destinatário não está cadastrado!')
            }

            cte = {

              nCT: json.cteProc.CTe.infCte.ide.nCT,
              cCT: json.cteProc.CTe.infCte.ide.cCT,
              serieCT: json.cteProc.CTe.infCte.ide.serie,
              chaveCT: json.cteProc.protCTe.infProt.chCTe,
              tpCTe: json.cteProc.CTe.infCte.ide.tpCTe,
              dhEmi: dayjs(json.cteProc.CTe.infCte.ide.dhEmi).format('YYYY-MM-DD HH:mm:ss'),
              CFOP: json.cteProc.CTe.infCte.ide.CFOP,

              cStat: json.cteProc.protCTe.infProt.cStat,
              xMotivo: json.cteProc.protCTe.infProt.xMotivo,
              nProt: json.cteProc.protCTe.infProt.nProt,
              dhRecbto: dayjs(json.cteProc.protCTe.infProt.dhRecbto).format('YYYY-MM-DD HH:mm:ss'),

              codigoUnidade: 1,
              vTPrest: json.cteProc.CTe.infCte.vPrest.vTPrest,
              valorAReceber: json.cteProc.CTe.infCte.vPrest.vRec,

              recipientId: recipient.id,

              xml

            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS00) {
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS00.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS00.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS20) {
              cte.pRedBC = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.pRedBC
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS45) {
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS45.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS45.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS60) {
              cte.pICMS = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.pICMSSTRet
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.CST
            }

            const receivement = await db.Receivement.create({
              companyId: 1,
              payerId: sender.id,
              documentNumber: cte.nCT,
              description: `Recebimento do CT-e ${cte.nCT}`,
              total: cte.valorAReceber,
              releaseDate: cte.dhEmi,
              issueDate: cte.dhEmi,
              categorieId: 1766,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }, {transaction})

            await db.ReceivementInstallment.create({
              receivementId: receivement.id,
              description: receivement.description,
              installment: 1,
              dueDate: dayjs(cte.dhEmi).add(sender?.diasPrazoPagamento || 0, 'day').format('YYYY-MM-DD'),
              amount: cte.valorAReceber,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }, {transaction})

            cte.receivementId = receivement.id

            await db.Cte.create(cte, {transaction})

          })

        }


        res.status(200).json({})

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async addNfe(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          const nfe = await db.Nfe.findOne({attributes: ['id'], where: [{chaveNf: req.body.chaveNf}], transaction})

          const cteNfe = await db.CteNfe.findOne({attributes: ['id'], where: [{IDCte: req.body.cteId, IDNota: nfe.id}], transaction})

          if (cteNfe) {
            res.status(201).json({message: 'Nota fiscal já está incluída!'})
            return
          }

          if (!nfe) {

          }

          await db.CteNfe.create({cteId: req.body.cteId, nfeId: nfe.id})
          
          res.status(200).json({cteNfe})

        })


      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async deleteNfe(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          await db.CteNfe.destroy({where: [{id: req.body.id}], transaction})

        })

        res.status(200).json({})

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

}