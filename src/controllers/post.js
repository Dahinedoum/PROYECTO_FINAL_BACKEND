import Post from '../models/post.js'
import User from '../models/user.js'
import UserPostLike from '../models/user_post_like.js'
import { validatePostAllergies } from '../utils/post.js'
//Get posts
/**
 * @return {Promise<object[]>}
 */
export const getPosts = async (filters) => {
  const filtersData = {}
  if (filters) {
    if (filters.type) {
      filtersData.type = filters.type
    }
  }
  return Post.find(filtersData)
}

//Get post by id
/**
 * @param {string} id
 * @return {Promise<object>}
 */
export const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id })

  if (!post) {
    throw new Error('Post not found')
  }

  const likes = await UserPostLike.find({ postId: post._id }).select('userId')

  const likedBy = likes.map((like) => like.userId)

  return {
    ...post.toObject(),
    likedBy: likedBy,
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
