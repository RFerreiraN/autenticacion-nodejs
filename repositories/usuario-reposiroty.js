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
}
