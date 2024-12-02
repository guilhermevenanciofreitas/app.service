import express, { Router } from 'express'
import serverless from 'serverless-http'
import bodyParser from 'body-parser'
import path from 'path'

const app = express();
const router = Router()

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello from Express.js!</h1>')
  res.end()
})
router.get('/another', (req, res) => res.json({ route: req.originalUrl }))
router.post('/', (req, res) => res.json({ postBody: req.body }))

app.use(bodyParser.json())
app.use('/.netlify/functions/server', router)

const __dirname = path.resolve()
app.use('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

export default app
export const handler = serverless(app)