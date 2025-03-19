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

              db.Statement.update({importedAt: dayjs().format('YYYY-MM-DD HH:mm')}, {where: [{id: req.body.statementId}], transaction})

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
  
                statementData = await db.StatementData.create(statementData, {transaction})

                //if (statementData.data?.status == 'paid') {
                
                if (parseFloat(statementData.gross) > 0) {

                  await db.StatementDataConciled.create({
                      //name: receivement?.name,
                      statementDataId: statementData.id,
                      //receivementId: receivement?.id,
                      action: 'receivement',
                      type: 'receipt',
                      //paymentCategorieId: 'ea7090fb-4861-495a-9f6d-ae1b32dfc6f8', //1.01 - Venda no Mercado Livre
                      amount: parseFloat(statementData.gross)
                    },
                    {transaction}
                  )

                }
            
                if (parseFloat(statementData.coupon) > 0) {
                  await db.StatementDataConciled.create({
                    //name: 'MERCADO LIVRE',
                    statementDataId: statementData.id,
                    action: 'receivement',
                    type: 'coupon',
                    //paymentCategorieId: '605a2641-fe34-4020-aa2c-ed674f733d56', //1.02 - Crédito - Reembolso Mercado Livre
                    amount: parseFloat(statementData.coupon)},
                    {transaction}
                  )
                }
            
                if (parseFloat(statementData.fee) < 0) {
                  await db.StatementDataConciled.create({
                    //name: 'MERCADO LIVRE',
                    statementDataId: statementData.id,
                    action: 'payment',
                    type: 'fee',
                    //paymentCategorieId: '8e00db9e-9228-43b8-b53c-5ed9c37b7440', //'2.05 - Taxas e Tarifas ecommerce
                    amount: parseFloat(statementData.fee)},
                    {transaction}
                  )
                }
            
                if (parseFloat(statementData.shipping) < 0) {
                  await db.StatementDataConciled.create({
                    //name: 'MERCADO LIVRE',
                    statementDataId: statementData.id,
                    action: 'payment',
                    type: 'shipping',
                    //paymentCategorieId: '9396efce-2bf1-447f-bcc4-0bfb6f07637b', //'4.3 - Fretes
                    amount: parseFloat(statementData.shipping)}, 
                    {transaction}
                  )
                }
            
                if (parseFloat(statementData.shippingCost) > 0) {
                    await db.StatementDataConciled.create({
                      statementDataId: statementData.id,
                      action: 'payment',
                      type: 'shippingCost',
                      //paymentCategorieId: 'fb94a2db-6663-4ac9-8f57-42a16e6f58a5', //'4.4 - Frete pago pelo cliente direto ao Mercado Li
                      amount: (parseFloat(statementData.shippingCost) * -1)},
                      {transaction}
                    )
                }

                /*
                if (statementData.data?.status == 'cancelled') {

                  let originId = undefined;
                  let destinationId = undefined;
                  let amount = 0;

                  if (parseFloat(statementData.debit) < 0) {
                    originId = '8112d70d-da04-4efe-a2c7-b0d482ed0835';
                    destinationId = '7b881ac5-20c4-46af-a6d5-823d4c511431';
                    amount = parseFloat(statementData.debit);
                  }

                  if (parseFloat(statementData.credit) > 0) {
                    originId = '7b881ac5-20c4-46af-a6d5-823d4c511431';
                    destinationId = '8112d70d-da04-4efe-a2c7-b0d482ed0835';
                    amount = parseFloat(statementData.credit);
                  }

                  await db.StatementDataConciled.create({
                    statementDataId: statementData.id,
                    action: 'transfer',
                    type: 'transfer',
                    originId,
                    destinationId,
                    amount: amount}, {transaction}
                  );
                    
                }
                */

              
    
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