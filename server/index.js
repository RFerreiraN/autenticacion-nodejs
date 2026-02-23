import express from 'express'
import dotenv from 'dotenv'
import { conectUserDb } from '../db/usuarios_db_mongo.js'
import { validateUsuario } from '../Schema/userSchema.js'
import { UsuarioRepository } from '../repositories/usuario-reposiroty.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()

await conectUserDb()

app.use(express.static('client'))
app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + 'client/index.html')
})

app.post('/login', (req, res) => {
  res.json({ usuario: 'Ricardo' })
})
app.post('/register', async (req, res) => {
  const result = validateUsuario(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { username, password } = result.data
  try {
    const user = await UsuarioRepository.create({ username, password })
    res.status(201).json({
      message: 'Usuario creado',
      user: { id: user._id, username: user.username }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' })
    } else {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
})
app.post('/logout', (req, res) => { })

app.listen(PORT, () => {
  console.log(`Server Listenig on port: http://localhost:${PORT}`)
})
