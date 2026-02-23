import { User } from '../Models/usuarioModel.js'
import bcrypt from 'bcrypt'

export class UsuarioRepository {
  static async create({ username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10)

    return await User.create({
      username,
      password: hashedPassword
    })
  }

  static async login({ username, password }) {
    const user = await User.findOne({ username })
    if (!user) {
      throw new Error('El usuario no existe')
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('La contraseña es incorrecta')
    }

    return user
  }
}
