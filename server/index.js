import express from 'express'
import dotenv from 'dotenv'
import { conectUserDb } from '../db/usuarios_db_mongo.js'
import { validateUsuario } from '../Schema/userSchema.js'
import { UsuarioRepository } from '../repositories/usuario-reposiroty.js'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()

await conectUserDb()

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/login', async (req, res) => {
  const result = validateUsuario(req.body)

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { username, password } = result.data

  try {
    const user = await UsuarioRepository.login({ username, password })
    return res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (error) {
    return res.status(401).json({ message: error.message })
  }
})

app.post('/register', async (req, res) => {
  const result = validateUsuario(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { username, password } = result.data
  try {
    const user = await UsuarioRepository.create({ username, password })
    return res.status(201).json({
      message: 'Usuario creado',
      user: { id: user._id, username: user.username }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' })
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
})
app.post('/logout', (req, res) => { })

app.get('/protected', (req, res) => {
  res.render('protected', { username: req.body.username || 'Usuario' })
})

app.listen(PORT, () => {
  console.log(`Server Listenig on port: http://localhost:${PORT}`)
})
