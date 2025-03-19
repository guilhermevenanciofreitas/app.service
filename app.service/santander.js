import axios from 'axios'
import fs from 'fs'
import https from 'https'
import qs from 'qs'

let data = qs.stringify({
  'client_id': 'RD4Fw7KxB7u9ISpE099LeVGuRYZGYnty',
  'client_secret': 'zwm1iVKFLmAoSasx',
  'grant_type': 'client_credentials',
  'scope': 'extrato'
})

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('C:\\Users\\Jeremias\\Downloads\\Certificado GP\\certificado.cer'),
  ca: fs.readFileSync('C:\\Users\\Jeremias\\Downloads\\Certificado GP\\certificado.pem')
})

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://trust-open-h.api.santander.com.br/auth/oauth/v2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  httpsAgent,
  data
}

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data))
})
.catch((error) => {
  console.error('Erro na requisição:', error)
})