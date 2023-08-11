import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  togglePostFavByUser,
  togglePostLikeByUser,
} from '../controllers/post.js'

const router = express.Router()
/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: the post title
 *        type:
 *          type: string
 *          description: food's type
 *        duration:
 *          type: number
 *          description: duration of the recipe
 *        difficulty:
 *          type: string
 *          description: difficulty level
 *        allergies:
 *          type: string
 *          description: allergens it may contain
 *        description:
 *          type: string
 *          description: food description
 *        ingredients:
 *          type: string
 *          description: list of ingredients
 *        diners:
 *          type: number
 *          description: number of diners
 *        steps:
 *          type: string
 *          description: steps to follow
 *        required:
 *          -title
 *          -type
 *          -duration
 *          -ingredients
 *          -steps
 *        example:
 *          title: potato omelette
 *          type: salad
 *          duration: 15 minuts
 *          difficulty: easy
 *          allergies: eggs
 *          description: The potato omelette is an omelet to which previously cut and chopped potatoes are added, which is considered the typical dish of Spanish gastronomy, found in any restaurant in the country.
 *          ingredients: eggs, potato
 *          diners: 2 - 3
 *          steps:
 *              title: step 1
 *              description: beat 2 - 3 eggs
 *              title: step 2
 *              description: cut potatoes and mix with the egg
 *  *           title: step 3
 *              description: put everything in the pan
 */

// Get posts
/**
 * @swagger
 * /posts:
 * get:
 *  suamary: get all posts
 *  tags: [Posts]
 *  responses:
 *      200:
 *        description: all posts
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post' *
 */
router.get('/', async (request, response) => {
  try {
    const posts = await getPosts(request.query)
    response.json({ posts })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Get post by id
/**
 * @swagger
 * /posts/{id}:
 *  get:
 *    summary: return post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the post id
 *    responses:
 *      200:
 *        description: post info
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: post not found
 */
router.get('/:id', async (request, response) => {
  try {
    const post = await getPostById(request.params.id)
    response.json({ post })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Create post
/**
 * @swagger
 * /posts:
 *  post:
 *    summary: create new post
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: post created
 */
router.post('/', async (request, response) => {
  try {
    const createdPost = await createPost({
      data: {
        ...request.body,
        userId: request.user._id,
      },
      user: request.user,
    })
    response.json({ post: createdPost })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Update post
/**
 * @swagger
 * /posts/{id}:
 *  put:
 *    summary: update post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: updated post
 *      404:
 *        description: post not found
 */
router.put('/:id', async (request, response) => {
  try {
    const updatedPost = await updatePostById({
      id: request.params.id,
      data: request.body,
      user: request.user,
    })
    response.json(updatedPost)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Delete post
/**
 * @swagger
 * /posts/{id}:
 *  delete:
 *    summary: delete post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the post id
 *    responses:
 *      200:
 *        description: post deleted
 *      404:
 *        description: post not found
 */
router.delete('/:id', async (request, response) => {
  try {
    await deletePostById({ postId: request.params.id, user: request.user })
    response.json({ deleted: true })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Favorite post route
/**
 * @swagger
 * /posts/{id}/favs:
 *  post:
 *    summary: favorite status of a post by user
 *    tags: [Post]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: id of the post to add favorite status
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: favorite status toggled successfully
 *      404:
 *        description: post not found
 */
router.post('/:id/favs', async (request, response) => {
  try {
    await togglePostFavByUser(request.params.id, request.user)
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

router.post('/:id/likes', async (request, response) => {
  try {
    await togglePostLikeByUser(request.params.id, request.user)
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

export default router
