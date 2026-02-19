import express from 'express'
import dotenv from 'dotenv'
import { UserRepository } from '../user-repository.js'

dotenv.config()

const app = express()

app.use(express.static('client'))
app.use(express.json())

const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.post('/login', (req, res) => {
  res.json({ nombre: 'Ricardo Ferreira' })
})

app.post('/register', (req, res) => {
  const { username, password } = req.body
  try {
    const id = UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send({ error })
  }
})

app.post('/logout', (req, res) => {

})

app.get('/protected', (req, res) => {
  res.json({ message: 'Ruta Protegida' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`)
})
