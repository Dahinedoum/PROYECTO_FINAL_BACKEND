import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostLike from '../models/user_post_like.js'
import UserPostComment from '../models/user_post_comment.js'

import { validatePostAllergies } from '../utils/post.js'

/**
 * {object} filters
 * {object} user
 * @return {Promise<object[]>}
 */
export const getPosts = async ({ filters, user }) => {
  const filtersData = {}
  if (filters) {
    if (filters.type) {
      filtersData.type = filters.type
    }
  }
  let posts = await Post.find(filtersData)

  const postsIds = posts.map((post) => post._id)
  const likedPosts = await UserPostLike.find({
    postId: { $in: postsIds },
    userId: user._id,
  })

  posts = posts.map((post) => {
    let isFav = false
    let isShared = false
    let isLike = false

    if (user.favPosts && user.favPosts.length > 0) {
      isFav = user.favPosts.includes(post._id.toString())
    }

    if (user.sharedPosts && user.sharedPosts.length > 0) {
      isShared = user.sharedPosts.includes(post._id.toString())
    }

    if (likedPosts && likedPosts.length > 0) {
      isLike = !!likedPosts.find(
        (likedPost) => likedPost.postId.toString() === post._id.toString()
      )
    }

    return {
      ...post.toObject(),
      isFav,
      isShared,
      isLike,
    }
  })

  return posts
}

/**
 * @param {string} id
 * @return {Promise<object>}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  const postComments = await UserPostComment.find({
    postId: post._id,
  })
  const likes = await UserPostLike.find({ postId: post._id }).select('userId')
  const numberOfLikes = likes.length
  const likedBy = likes.map((like) => like.userId)

  return {
    ...post.toObject(),
    likes: numberOfLikes,
    likedBy: likedBy,
    comments: postComments,
  }
}

//Create post
/**
 * @param {object} data
 * @param {string} data.userId
 * @param {string} data.mainImage
 * @param {string} data.title
 * @param {"Salad" | "Dessert" | "Breakfast"} data.type
 * @param {number} data.duration
 * @param {"Easy" | "Moderate" | "Difficult"} data.difficulty
 * @param {"Gluten" | "Crustaceans" | "Eggs" | "Fish" | "Peanuts" | "Soy" | "Dairy" | "Nuts in shell" | "Celery"  | "Mustard" | "Sesame" | "Sulphites" | "Lupins" | "Mollusks"} data.allergies
 * @param {string} data.description
 * @param {{ name: string, quantity: number, unity: "Liter" | "Milliliters" | "Kilograms" | "Grams" | "Pound" | "Ounce" | "Tablespoon" | "Tablespoon dessert" }} data.ingredients
 * @param {number} data.diners
 * @param {{title: string, description: string, order: number, image: string }} data.steps
 */
export const createPost = async ({ data, user }) => {
  const {
    mainImage,
    title,
    type,
    duration,
    difficulty,
    allergies,
    description,
    ingredients,
    diners,
    steps,
    userId,
  } = data

  if (!user) {
    throw new Error("You can't post if you are not registred")
  }

  const existPost = await Post.findOne({ title, type, userId })
  if (existPost) {
    throw new Error('This post already exist!')
  }

  const validPostType = ['Salad', 'Dessert', 'Breakfast']
  if (!validPostType.includes(type)) {
    throw new Error('This is not valid type')
  }

  const validPostDifficulty = ['Easy', 'Moderate', 'Difficult']
  if (!validPostDifficulty.includes(difficulty)) {
    throw new Error('This is not valid difficulty')
  }

  const validPostIngredientsUnity = [
    'Liter',
    'Milliliters',
    'Kilograms',
    'Grams',
    'Pound',
    'Ounce',
    'Tablespoon',
    'Tablespoon dessert',
  ]
  if (ingredients.unity) {
    if (!validPostIngredientsUnity.includes(ingredients.unity)) {
      throw new Error('This is not valid unity')
    }
  }

  if (allergies) {
    validatePostAllergies(allergies)
  }

  const post = new Post({
    userId,
    mainImage,
    title,
    type,
    duration,
    difficulty,
    allergies,
    description,
    ingredients,
    diners,
    steps,
  })
  return post.save()
}

//Update post
/**
 * @param {object} data
 * @param {string} data.userId
 * @param {string} data.mainImage
 * @param {string} data.title
 * @param {"Salad" | "Dessert" | "Breakfast"} data.type
 * @param {number} data.duration
 * @param {"Easy" | "Moderate" | "Difficult"} data.difficulty
 * @param {"Gluten" | "Crustaceans" | "Eggs" | "Fish" | "Peanuts" | "Soy" | "Dairy" | "Nuts in shell" | "Celery"  | "Mustard" | "Sesame" | "Sulphites" | "Lupins" | "Mollusks"} data.allergies
 * @param {string} data.description
 * @param {{ name: string, quantity: number, unity: "Liter" | "Milliliters" | "Kilograms" | "Grams" | "Pound" | "Ounce" | "Tablespoon" | "Tablespoon dessert" }} data.ingredients
 * @param {number} data.dinners
 * @param {{title: string, description: string, order: number, image: string }} data.steps
 */
export const updatePostById = async ({ id, data, user }) => {
  const {
    mainImage,
    title,
    type,
    duration,
    difficulty,
    allergies,
    description,
    ingredients,
    diners,
    steps,
  } = data

  const post = await Post.findOne({ _id: id })
  if (!post) {
    throw new Error('Post not found')
  }

  if (post.userId.toString() !== user._id.toString()) {
    throw new Error(`You can't edit this post`)
  }

  if (mainImage) {
    post.mainImage = mainImage
  }

  if (title) {
    post.title = title
  }

  if (duration) {
    post.duration = duration
  }

  if (steps) {
    post.steps = steps
  }

  if (diners) {
    post.diners = diners
  }

  if (description) {
    post.description = description
  }

  if (!user) {
    throw new Error("You can't post if you are not registred")
  }

  const validPostType = ['Salad', 'Dessert', 'Breakfast']
  if (type) {
    if (!validPostType.includes(type)) {
      throw new Error('This is not valid type')
    }
  } else {
    post.type = type
  }

  const validPostDifficulty = ['Easy', 'Moderate', 'Difficult']
  if (difficulty) {
    if (!validPostDifficulty.includes(difficulty)) {
      throw new Error('This is not valid difficulty')
    }
  } else {
    post.difficulty = difficulty
  }

  if (allergies) {
    validatePostAllergies(allergies)

    post.allergies = allergies
  }

  const validPostIngredientsUnity = [
    'Liter',
    'Milliliters',
    'Kilograms',
    'Grams',
    'Pound',
    'Ounce',
    'Tablespoon',
    'Tablespoon dessert',
  ]
  if (ingredients.unity) {
    if (!validPostIngredientsUnity.includes(ingredients.unity)) {
      throw new Error('This is not valid unity')
    }
  } else {
    post.ingredients.unity = ingredients.unity
  }

  await post.save()

  return post
}

//Delete post
/**
 * @param {string} postId
 * @param {string} userId
 * @param {object} user
 * @param {string} user._id
 * @returns {Promise<boolean>}
 */
export const deletePostById = async ({ postId, user }) => {
  const post = await getPostById(postId)

  if (post.userId.toString() !== user._id.toString()) {
    throw new Error(`You can't remove this post`)
  }
  await Post.deleteOne({ _id: postId })

  return true
}

//Favorite post controller
/**
 * @param {string} postId
 * @param {object} user
 * @param {object[]} user.favPosts
 */
export const togglePostFavByUser = async (postId, user) => {
  if (!postId) {
    throw new Error('id is required')
  }

  if (!user) {
    throw new Error('you must be registred')
  }

  const post = await getPostById(postId)
  const currentFavs = user.favPosts || []
  const existedFav = currentFavs.find(
    (currentId) => currentId.toString() === postId.toString()
  )

  let newFavList = []
  if (!existedFav) {
    newFavList = [...currentFavs, post]
  } else {
    newFavList = currentFavs.filter(
      (currentId) => currentId.toString() !== postId.toString()
    )
  }
  await User.updateOne({ _id: user._id }, { favPosts: newFavList })
}

//Like post controller
/**
 * @param {string} postId
 * @param {object} user
 * @param {object[]} user.likePosts
 * @param {object[]} post.likes
 */
export const togglePostLikeByUser = async (postId, user) => {
  if (!postId) {
    throw new Error('postId is required')
  }

  if (!user) {
    throw new Error('You must be registered')
  }

  const post = await Post.findById(postId)
  if (!post) {
    throw new Error('Post not found')
  }

  const existingLike = await UserPostLike.findOneAndDelete({
    postId: post._id,
    userId: user._id,
  })

  if (!existingLike) {
    const postLike = new UserPostLike({
      postId: post._id,
      userId: user._id,
    })
    await postLike.save()
  }
}

// Create comment controller
/**
 *
 * @param {string} postId
 * @param {object} data
 * @param {string} data.comment
 * @param {object} user
 * @param {string} user._id
 */
export const createPostCommentByUser = async ({ postId, data, user }) => {
  if (!data.comment) {
    throw new Error('Missing comment')
  }

  const post = await getPostById(postId)
  const postComment = new UserPostComment({
    postId: post._id,
    userId: user._id,
    comment: data.comment,
  })

  await postComment.save()
}

/**
 *
 * @param {string} commentId
 * @param {object} user
 * @param {string} user._id
 * @returns {Promise<boolean>}
 */
export const deletePostCommentByUser = async ({ commentId, user }) => {
  const comment = await UserPostComment.findOne({ _id: commentId })
  if (!comment) {
    throw new Error('Comment not found')
  }

  if (comment.userId.toString() !== user._id.toString()) {
    throw new Error('This comment can only be deleted by its author')
  }

  await UserPostComment.deleteOne({
    _id: commentId,
    userId: user._id,
  })

  return true
}

/**
 * @param {string} postId
 * @param {object} user
 * @param {string} userId
 * @param {object[]} user.sharedPosts
 */
export const toggleSharePost = async (postId, user) => {
  if (!postId) {
    throw new Error('id is required')
  }

  if (!user) {
    throw new Error('you must be registred')
  }

  const post = await getPostById(postId)
  const currentShares = user.sharedPosts || []
  const existedSharePost = currentShares.find(
    (currentId) => currentId.toString() === postId.toString()
  )

  let newSharedList = []
  if (!existedSharePost) {
    newSharedList = [...currentShares, post]
  } else {
    newSharedList = currentShares.filter(
      (currentId) => currentId.toString() !== postId.toString()
    )
  }
  await User.updateOne({ _id: user._id }, { sharedPosts: newSharedList })
}

/**
 * @param {string} postId
 * @param {object} data
 * @param {string} data.comment
 * @param {object} user
 * @param {string} user._id
 * @param {string} comment._id
 */
export const replyToComment = async ({ postId, commentId, data, user }) => {
  if (!data.comment) {
    throw new Error('Missing reply')
  }

  const parentComment = await UserPostComment.findById(commentId)
  if (!parentComment) {
    throw new Error('Parent comment not found')
  }

  const post = await getPostById(postId)
  const replyComment = new UserPostComment({
    postId: post._id,
    userId: user._id,
    comment: data.comment,
    replyTo: parentComment._id,
  })

  await replyComment.save()
}
