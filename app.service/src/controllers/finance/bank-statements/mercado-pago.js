import axios from "axios"
import { AppContext } from "../../../database/index.js"
import { Exception } from "../../../utils/exception.js"
import { Authorization } from "../../authorization.js"
import qs from 'qs';
import _ from 'lodash'


export class MercadoPago {

  //600 - success
  //601 - redirect auth.mercadolivre.com.br
  static async verify() {

    const db = new AppContext()

    var company = await db.CompanyIntegration.findOne({attributes: ['id', 'options'], where: [{id: '112D3E42-0F1A-4F08-9E05-FA1ED23C7166'}]});

    if (!company.options) {
      throw new Error('E necessário realizar o login!');
    }

    console.log('ok 2')

    let data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: '1928835050355270',
      client_secret: 'HS4Bo6e3KHgQF8jpRZvGg7zXjWFv7ybi', 
      refresh_token: JSON.parse(company.options).refresh_token
    })

    console.log(data)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.mercadolibre.com/oauth/token',
      headers: { 
        'accept': 'application/json', 
        'content-type': 'application/x-www-form-urlencoded'
      },
      data : data
    }

    const r = await axios.request(config)

    console.log('ok 3')

    console.log(r)

    const options = JSON.stringify({...JSON.parse(company.options), refresh_token: r.data.refresh_token})

    console.log(options)

    console.log('ok 4')

    company.options = options

    await company.save()

    console.log('ok 5')

    return r.data.access_token

  }

}

export class FinanceStatementMercadoPagoController {

  async statements(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
    
      console.log('ok 1')

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
      
              console.log(response.data)
      
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