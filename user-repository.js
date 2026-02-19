import DBLocal from 'db-local'
import crypto from 'node:crypto'

const { Schema } = new DBLocal({ path: './db' })

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!]).{8,12}$/

const User = Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create({ username, password }) {
    // 1. Validaciones de username y password

    if (typeof username !== 'string') throw new Error('El usuario debe ser una cadena de texto')
    if (username.length < 3) throw new Error('El usuario debe tener más de tres caracteres')

    if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena de texto')
    if (!password.match(regex)) throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayuscula, una minuscula, un número y un caracter especial')

    // 2. Asegurar que no existe el usuario antes de agragarlo

    const user = User.findOne({ username })
    if (user) {
      throw new Error('El usuario ya existe')
    }

    const id = crypto.randomUUID()

    const nuevoUsuario = new User({
      _id: id,
      username,
      password
    })

    nuevoUsuario.save()
    return id
  }
}
