import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  togglePostFavByUser,
  togglePostLikeByUser,
  // createPostCommentByUser,
  deletePostCommentByUser,
  toggleSharePost,
  replyToComment,
  guardarComentario,
  obtenerComentarios,
} from '../controllers/post.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *  securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *      required:
 *        - title
 *        - type
 *        - duration
 *        - ingredients
 *        - steps
 *      example:
 *        title: potato omelette
 *        type: salad
 *        duration: 15 minuts
 *        difficulty: easy
 *        allergies: eggs
 *        description: The potato omelette is an omelet to which previously cut and chopped potatoes are added, which is considered the typical dish of Spanish gastronomy, found in any restaurant in the country.
 *        ingredients: eggs, potato
 *        diners: 2 - 3
 *        steps:
 *          title: step 1
 *          description: beat 2 - 3 eggs
 *          title2: step 2
 *          description2: cut potatoes and mix with the egg
 *          title3: step 3
 *          description3: put everything in the pan
 */

// Get posts
/**
 * @swagger
 * /posts:
 *  get:
 *   security:
 *      - BearerAuth: []
 *   summary: get all posts
 *   tags: [Post]
 *   responses:
 *     200:
 *       description: all posts
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Post'
 */
router.get('/', async (request, response) => {
  try {
    const posts = await getPosts({ filters: request.query, user: request.user })
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
 *    security:
 *      - BearerAuth: []
 *    summary: return post by id
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
    response.json(post)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Create post
/**
 * @swagger
 * /posts:
 *  post:
 *    security:
 *      - BearerAuth: []
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
    const post = await createPost({
      data: {
        ...request.body,
        userId: request.user._id,
      },
      user: request.user,
    })
    response.json(post)
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Update post
/**
 * @swagger
 * /posts/{id}:
 *  put:
 *    security:
 *      - BearerAuth: []
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
 *    security:
 *      - BearerAuth: []
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
 *    security:
 *      - BearerAuth: []
 *    summary: favorite status of a post by user
 *    tags: [Post]
 *    parameters:
 *      - in: id
 *        name: path
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

// like to post
/**
 * @swagger
 * /posts/{id}/likes:
 *  post:
 *    security:
 *      - BearerAuth: []
 *    summary: add favorite status to post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of the post to add favorite status
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UserPostLike'
 *    responses:
 *      200:
 *        description: liked post
 *      404:
 *        description: post not found
 */
router.post('/:id/likes', async (request, response) => {
  try {
    await togglePostLikeByUser(request.params.id, request.user)
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

// // Create comment
// /**
//  * @swagger
//  * /posts/{potId}/comments:
//  *  post:
//  *    security:
//  *      - BearerAuth: []
//  *    summary: create comment on post
//  *    tags: [Post]
//  *    parameters:
//  *      - in: path
//  *        name: postId
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: id from post to create comment on this
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            $ref: '#/components/schemas/UserPostComment'
//  *    responses:
//  *      200:
//  *        description: updated post
//  *      404:
//  *        description: post not found
//  */
// router.post('/:postId/comments', async (request, response) => {
//   try {
//     await createPostCommentByUser({
//       postId: request.params.postId,
//       data: request.body,
//       user: request.user,
//     })
//     response.json(true)
//   } catch (error) {
//     response.status(500).json(error.message)
//   }
// })


router.post('/comentarios/', guardarComentario)
// Ruta para obtener comentarios de un post específico
router.get('/comentarios/:postId', obtenerComentarios)


//Delete comment
/**
 * @swagger
 * /posts/comments/{commentId}:
 *  delete:
 *    security:
 *      - BearerAuth: []
 *    summary: delete a  comment from post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: commentId
 *        schema:
 *          type: string
 *        required: true
 *        description: id from comment to delete this
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UserPostComment'
 *    responses:
 *      200:
 *        description: deleted comment
 *      404:
 *        description: post not found
 */
router.delete('/comments/:commentId', async (request, response) => {
  try {
    await deletePostCommentByUser({
      commentId: request.params.commentId,
      user: request.user,
    })
    response.json(true)
  } catch (error) {
    console.log(error)
    response.status(500).json(error.message)
  }
})

//Share post
/**
 * @swagger
 * /posts/{id}/share:
 *  post:
 *    security:
 *      - BearerAuth: []
 *    summary: share post and add this to wall
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of the post to share this on wall
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: liked post
 *      404:
 *        description: post not found
 */
router.post('/:id/share', async (request, response) => {
  try {
    await toggleSharePost(request.params.id, request.user)
    response.json(true)
  } catch (error) {
    response.status(500).json(error.message)
  }
})

//Reply to comment
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/reply:
 *  post:
 *    security:
 *      - BearerAuth: []
 *    summary: reply to created comment from post
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of the comment to reply this
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UserPostComment'
 *    responses:
 *      200:
 *        description: liked post
 *      404:
 *        description: post not found
 */
router.post('/:postId/comments/:commentId/reply', async (req, res) => {
  try {
    await replyToComment({
      postId: req.params.postId,
      commentId: req.params.commentId,
      data: req.body,
      user: req.user,
    })
    res.json(true)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

export default router
