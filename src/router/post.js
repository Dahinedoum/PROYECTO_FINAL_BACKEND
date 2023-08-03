import express from 'express'
import {
  getPosts,
  getPostById,
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




export default router