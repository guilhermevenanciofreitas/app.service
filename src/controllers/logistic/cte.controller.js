import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import * as cheerio from 'cheerio'
import { parseStringPromise } from 'xml2js'
import csv from 'csvtojson'
import axios from 'axios'
import _ from 'lodash'

const headers = {'Cookie': 'remember=1; useri=70145314170; sigla_emp=1TC; login=venancio; chave=5400DSKTVB; ssw_dom=1TC; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzI5MDY1NzUsInB4eSI6IjE3Mi4zMS41Ni4xOTQifQ.qIv1lwEd9OqitWUMn7aJm8KGB3nBUGMKvDrnXX0nMYc'}

export class LogisticCteController {

  import = async (req, res) => {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const response = await axios.post('https://sistema.ssw.inf.br/bin/ssw1440', null, {headers});

        const $ = cheerio.load(response.data)

        const json = await parseStringPromise($('xml').html().toString());

        for (const item of json.rs.r) {

          if (item.f0[0] != '238449') {
            return
          }

          if (item.f1[0] == '930 - Gera BD de Ocorr&ecirc;ncias') {

              console.log(`[Importando] - ${item.f0[0]} | ${item.f1[0]}`);

              //await importarOcorrencias(item.f0[0]);

          }

          if (item.f1[0] == '455 - Fretes Expedidos/Recebidos - CTRCs') {

              console.log(`[Importando] - ${item.f0[0]} | ${item.f1[0]}`);

              await this.uploadCte(item.f0[0]);

          }
          
        }
        res.status(200).json({});

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  uploadCte = async (code) => {

    const db = new AppContext();

    const ssw = await db.IntegrationSSW.findOne({attributes: ['id'], where: [{code}]});

    if (ssw) {
        return;
    }

    const response = await this.downloadFile(code);

    let data = response.data.split('\n');

    data.shift();
    data.pop();

    const json = await csv({delimiter: ';'}).fromString(data.join('\n'));

    await db.transaction(async (transaction) => {
        
        await db.IntegrationSSW.create({code}, {transaction})

        for (const item of json) {

            const row = {
              serieCt: _.toNumber(item['Serie/Numero CT-e']?.substring(0, 3)),
              numeroCt: _.toNumber(item['Serie/Numero CT-e']?.substring(4, 12)),
              chaveCt: item['Chave CT-e']?.substring(0, 44),
            }

            console.log(row)

        }
    })

  }

  downloadFile = async (code) => {

    const url = `https://sistema.ssw.inf.br/bin/ssw0424?act=CSV1TC00${code}.sswweb&filename=CSV1TC00${code}.csv&path=/usr/aws/jobs/1TC/&down=1`;

    return await axios.get(url, {headers});

}



}