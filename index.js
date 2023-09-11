import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import { fileURLToPath } from 'url'
import { ensureAuthenticated } from './src/middleware/auth.js'
import authRouter from './src/router/auth.js'
import postsRouter from './src/router/post.js'
import usersRouter from './src/router/user.js'
import connectToDb from './src/services/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerSpec = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Food social media API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [`${path.join(__dirname, './src/router/*.js')}`],
}

dotenv.config()

const startApp = async () => {
  const app = express()
  const port = process.env.PORT

  app.use(cors())

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  app.use(
    '/api-doc',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJSDoc(swaggerSpec))
  )

  app.use(ensureAuthenticated)
  app.use('/auth', authRouter)
  app.use('/posts', postsRouter)
  app.use('/users', usersRouter)


  try {
    await connectToDb()
    app.listen(port, () => {
      console.log(`Server start in ${port}`)
    })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

startApp()
