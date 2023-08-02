import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";


dotenv.config()

const startApp = async () => {
  const app = express()
  const port = process.env.PORT
  app.use(cors())
  app.use(ensureAuthenticated)

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

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