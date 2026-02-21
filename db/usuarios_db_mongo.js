import mongoose from 'mongoose'

export async function conectUserDb() {
  try {
    await mongoose.connect(process.env.URL_DB)
    console.log('Conectado a base de datos')
  } catch (error) {
    console.error('Error conectando a base de datos', error)
    process.exit(1)
  }
}
