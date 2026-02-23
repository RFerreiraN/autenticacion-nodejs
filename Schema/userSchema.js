import z from 'zod'

const usuarioSchema = z.object({
  username: z.string().trim().min(3).max(15),
  password: z.string().min(6)
})

export function validateUsuario(objeto) {
  return usuarioSchema.safeParse(objeto)
}
