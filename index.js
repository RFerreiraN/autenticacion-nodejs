import express from 'express'

const PORT = process.env.PORT ?? 3000

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hola Idiotas' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`)
})
