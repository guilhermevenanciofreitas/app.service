import { app } from './src/server.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando localmente na porta ${PORT}`)
})