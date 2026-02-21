import express from 'express'
import dotenv from 'dotenv'
import { conectUserDb } from '../db/usuarios_db_mongo.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()

await conectUserDb()

app.use(express.static('client'))
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + 'client/index.html')
})

app.post('/login', (req, res) => {
  res.json({ usuario: 'Ricardo' })
})
app.post('/register', (req, res) => { })
app.post('/logout', (req, res) => { })

app.listen(PORT, () => {
  console.log(`Server Listenig on port: http://localhost:${PORT}`)
})
