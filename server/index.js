import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
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
app.use(cookieParser())

app.get('/', (req, res) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.render('index', { user: null })
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT_KEY)
    res.render('index', { user: data })
  } catch (error) {
    res.render('index', { user: null })
  }
})

app.post('/login', async (req, res) => {
  const result = validateUsuario(req.body)

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { username, password } = result.data

  try {
    const user = await UsuarioRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: '1h'
      })
    return res.status(200)
      .cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 1000 * 60 * 60 })
      .json({
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
app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Sesión cerrada' })
})

app.get('/protected', (req, res) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(403).json({ message: 'Usuario no autorizado' })
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT_KEY)
    res.render('protected', data)
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
})

app.listen(PORT, () => {
  console.log(`Server Listenig on port: http://localhost:${PORT}`)
})
