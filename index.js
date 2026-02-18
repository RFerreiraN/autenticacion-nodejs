import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.post('/login', (req, res) => {
  res.json({ nombre: 'Ricardo Ferreira' })
})

app.post('/register', (req, res) => {

})

app.post('/logout', (req, res) => {

})

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`)
})
