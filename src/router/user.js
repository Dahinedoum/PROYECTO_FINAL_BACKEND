import express from 'express'
import {
  getAllUsers,
  getUserById,
  removeUserById,
  toggleFollowingByUser,
  updateUserInfo,
  getFollowersByUser,
} from '../controllers/user.js'

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
 *        avatar:
 *          type: string
 *          description: the photo url of the user
 *        city:
 *          type: string
 *          description: the city of the user
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
 *        avatar: https://pixabay.com/es/vectors/hombre-masculino-avatar-an%C3%B3nimo-303792/
 *        city: Tokyo
 *        country: Japan
 *
 */

//TODO añadir cabeceras para el token

/**
 * @swagger
 * /users:
 *  get:
 *    summary: return all users
 *    tags: [User]
 *    responses:
 *      200:
 *        description: all users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */

router.get('/', async (request, response) => {
  try {
    const users = await getAllUsers(request.user)
    response.json({ users })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /users/me:
 *  get:
 *    summary: return the current user
 *    tags: [User]
 *    responses:
 *      200:
 *        description: the current user info
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */

router.get('/me', async (request, response) => {
  try {
    response.json(request.user)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: return a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    responses:
 *      200:
 *        description: the user info
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: user not found
 */

router.get('/:id', async (request, response) => {
  try {
    const user = await getUserById(request.params.id)
    response.json({ user })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /users/me:
 *  put:
 *    summary: update a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: updated user
 *      404:
 *        description: user not found
 */

router.put('/me', async (request, response) => {
  try {
    const updatedUser = await updateUserInfo({
      user: request.user,
      data: request.body,
    })
    response.json({ updatedUser })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: delete a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    responses:
 *      200:
 *        description: user deleted
 *      404:
 *        description: user not found
 */

router.delete('/:id', async (request, response) => {
  try {
    await removeUserById(request.params.id, request.user)
    response.json({ removed: true })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

/**
 * @swagger
 * /users/{id}/follow:
 *  post:
 *    summary: follow an user
 *    tags: [User]
 *    parameters:
 *      - in: id
 *        name: path
 *        description: id of the user to follow
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: following toggled successfully
 *      404:
 *        description: user not found
 */

router.post('/:id/follow', async (request, response) => {
  try {
    await toggleFollowingByUser(request.params.id, request.user)
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

//Followers

/**
 * @swagger
 * /users/{id}/followers:
 *  get:
 *    summary: get followers of a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    responses:
 *      200:
 *        description: list of user followers
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                followers:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      404:
 *        description: user not found
 */

router.get('/:id/followers', async (request, response) => {
  try {
    const followers = await getFollowersByUser(request.params.id)
    response.json({ followers })
  } catch (error) {
    response.status(500).json(error.message)
  }
})

// router.get('/:id/following', async (request, response) => {
//   try {
//     const following = await getFollowersByUser(request.params.id)
//     response.json({ following })
//   } catch (error) {
//     response.status(500).json(error.message)
//   }
// })

export default router
