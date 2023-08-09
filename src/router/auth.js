import express from 'express'
import { login, signup } from '../controllers/auth.js'

const router = express.Router()

router.post('/login', async (request, response) => {
  try {
    const token = await login(request.body)
    response.json(token)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

router.post('/signup', async (request, response) => {
  try {
    const token = await signup(request.body)
    response.json(token)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
