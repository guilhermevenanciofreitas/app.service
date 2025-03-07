import axios from "axios"
import { AppContext } from "../../../database/index.js"
import { Exception } from "../../../utils/exception.js"
import { Authorization } from "../../authorization.js"
import qs from 'qs';
import csv from 'csvtojson';
import _ from 'lodash'
import { StatementData } from "../../../database/models/statementData.model.js";
import dayjs from "dayjs";


export class MercadoPago {

  //600 - success
  //601 - redirect auth.mercadolivre.com.br
  static async verify() {

    const db = new AppContext()

    var company = await db.CompanyIntegration.findOne({attributes: ['id', 'options'], where: [{id: '1DDE04C4-491B-4F55-BB32-6EFB84A39E91'}]});

    if (!company.options) {
      throw new Error('E necessário realizar o login!');
    }

    let data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: '1928835050355270',
      client_secret: 'HS4Bo6e3KHgQF8jpRZvGg7zXjWFv7ybi', 
      refresh_token: JSON.parse(company.options).refresh_token
    })

    let config = {
      method: 'post',
      url: 'https://api.mercadolibre.com/oauth/token',
      headers: { 
        'accept': 'application/json', 
        'content-type': 'application/x-www-form-urlencoded'
      },
      data : data
    }

    const r = await axios.request(config)

    const options = JSON.stringify({...JSON.parse(company.options), refresh_token: r.data.refresh_token})

    company.options = options

    await company.save()

    return r.data.access_token

  }

}

export class FinanceStatementMercadoPagoController {

  statements = async (req, res) => {
    await Authorization.verify(req, res).then(async ({company}) => {
      await MercadoPago.verify().then(async (access_token) => {
          try {

              let config = {
                method: 'get',
                url: 'https://api.mercadopago.com/v1/account/release_report/list',
                headers: { 
                  'Content-Type': 'application/json', 
                  //'Authorization': `Bearer ${access_token}`
                  'Authorization': `Bearer ${access_token}`
                }
              };
      
              const response = await axios.request(config)
      
              res.status(200).json({response: response.data})
      
          } catch (error) {
            Exception.error(res, error)
          }
      }).catch((error) => {
        Exception.error(res, error)
      })
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

  statement = async (req, res) => {
    await Authorization.verify(req, res).then(async ({company}) => {
      await MercadoPago.verify().then(async (access_token) => {
          try {

            
            let config = {method: 'get', url: `https://api.mercadopago.com/v1/account/release_report/${req.body.fileName}`, headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}`}}
    
            const response = await axios.request(config)

            var json = await csv().fromString(response.data)

            const db = new AppContext()

            await db.transaction(async (transaction) => {

              for(var item of json) {

              
                let statementData = new StatementData();
  
                statementData.id = undefined;
                statementData.shippingCost = undefined;
                statementData.statementId = req.body.statementId;              
                statementData.date = item.DATE ? dayjs(new Date(item.DATE)).format('YYYY-MM-DD HH:mm:ss') : null;
                statementData.description = item.DESCRIPTION;
                statementData.sourceId = item.SOURCE_ID.toString();
                statementData.orderId = item.ORDER_ID.toString();
                statementData.gross = parseFloat(item.GROSS_AMOUNT);
                statementData.coupon = parseFloat(item.COUPON_AMOUNT);
                statementData.fee = parseFloat(item.MP_FEE_AMOUNT);
                statementData.shipping = parseFloat(item.SHIPPING_FEE_AMOUNT);
                statementData.debit = parseFloat(item.NET_DEBIT_AMOUNT) * -1;
                statementData.credit = parseFloat(item.NET_CREDIT_AMOUNT);
                statementData.balance = parseFloat(item.BALANCE_AMOUNT);
                //statementData.data = undefined;
  
                statementData = await db.StatementData.create(statementData, {transaction});
  
              }
  
            })
            
            res.status(200).json({response: response.data})

          } catch (error) {
            Exception.error(res, error)
          }
      }).catch((error) => {
        Exception.error(res, error)
      })
    }).catch((error) => {
      Exception.unauthorized(res, error)
    })
  }

}