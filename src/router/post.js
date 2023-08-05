import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
} from '../controllers/post.js'

const router = express.Router()

// Get posts
router.get('/', async (request, response) => {
  try {
    const posts = await getPosts(request.query)
    response.json({ posts })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Get post by id
router.get('/:id', async (request, response) => {
  try {
    const post = await getPostById(request.params.id)
    response.json({ post })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Create post 
router.post('/', async (request, response) => {
  try {
    const createdPost = await createPost({
      data: {
        ...request.body,
        sellerId: request.user._id,
      },
      user: request.user,
    })
    response.json({ post: createdPost })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

// Update post 
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
router.delete('/:id', async (request, response) => {
  try {
    await deletePostById({ postId: request.params.id, user: request.user })
    response.json({ deleted: true })
  } catch (e) {
    response.status(500).json(e.message)
  }
})

export default router