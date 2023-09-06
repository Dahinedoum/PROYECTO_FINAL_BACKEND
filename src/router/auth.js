import express from 'express'
import { login, signup } from '../controllers/auth.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: the user email
 *        password:
 *          type: string
 *          description: the user password
 *        username:
 *          type: string
 *          description: the user username
 *        firstName:
 *          type: string
 *          description: the user first name
 *        lastName:
 *          type: string
 *          description: the user last name
 *        age:
 *          type: integer
 *          description: age of user
 *        gender:
 *          type: string
 *          description: the gender of the user
 *        biography:
 *          type: string
 *          description: a description of the user
 *        country:
 *          type: string
 *          description: the country of the user
 *      required:
 *        - email
 *        - password
 *        - username
 *      example:
 *        email: test@test.com
 *        password: test
 *        username: test19
 *        firstName: Test
 *        lastName: Tester
 *        age: 25
 *        gender: male
 *        biography: i love to cook!
 *        country: Japan
 *
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: login of user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: user logged
 */

router.post('/login', async (request, response) => {
  try {
    const token = await login(request.body)
    response.json(token)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: register a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: new user registered
 */

router.post('/signup', async (request, response) => {
  try {
    const token = await signup(request.body)
    response.json(token)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
