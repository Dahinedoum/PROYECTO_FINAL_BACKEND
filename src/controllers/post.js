import Post from '../models/post.js'
import User from '../models/user.js'
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

  return {
    ...post.toObject(),
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
 * @param {{ name: string, quantity: number, unity: "Liter" | "Milliliter" | "Kilograms" | "Grams" | "Pound" | "Ounce" | "Tablespoon" | "Tablespoon dessert" }} data.ingredients
 * @param {number} data.diners
 * @param {{title: string, description: string, order: number, image: string }} data.steps
 */
export const createPost = async ({ data, user }) => {
  const {
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

  const validPostAllergies = [
    'Gluten',
    'Crustaceans',
    'Eggs',
    'Fish',
    'Peanuts',
    'Soy',
    'Dairy',
    'Nuts in shell',
    'Celery',
    'Mustard',
    'Sesame',
    'Sulphites',
    'Lupins',
    'Mollusks',
  ]

  const validPostIngredientsUnity = [
    'Liter',
    'Milliliter',
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
    if (!validPostAllergies.includes(allergies)) {
      throw new Error('This is not valid allergie')
    }
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
 * @param {{ name: string, quantity: number, unity: "Liter" | "Milliliter" | "Kilograms" | "Grams" | "Pound" | "Ounce" | "Tablespoon" | "Tablespoon dessert" }} data.ingredients
 * @param {number} data.dinners
 * @param {{title: string, description: string, order: number, image: string }} data.steps
 */
export const updatePostById = async ({ id, data, user }) => {
  const {
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
  } = data

  const post = await Post.findOne({ _id: id })
  if (!post) {
    throw new Error('Post not found')
  }

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('no tienes permiso')
  }

  if (userId) {
    post.userId = userId
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
  if (!validPostType.includes(type)) {
    throw new Error('This is not valid type')
  }

  const validPostDifficulty = ['Easy', 'Moderate', 'Difficult']
  if (!validPostDifficulty.includes(difficulty)) {
    throw new Error('This is not valid difficulty')
  }

  const validPostAllergies = [
    'Gluten',
    'Crustaceans',
    'Eggs',
    'Fish',
    'Peanuts',
    'Soy',
    'Dairy',
    'Nuts in shell',
    'Celery',
    'Mustard',
    'Sesame',
    'Sulphites',
    'Lupins',
    'Mollusks',
  ]
  if (!validPostAllergies.includes(allergies)) {
    throw new Error('This is not valid allergie')
  }

  const validPostIngredientsUnity = [
    'Liter',
    'Milliliter',
    'Kilograms',
    'Grams',
    'Pound',
    'Ounce',
    'Tablespoon',
    'Tablespoon dessert',
  ]
  if (!validPostIngredientsUnity.includes(ingredients.unity)) {
    throw new Error('This is not valid unity')
  }

  await post.save()

  return post
}

//Delete post
/**
 * @param {string} postId
 * @param {string} sellerId
 * @param {object} user
 * @param {string} user._id
 * @returns {Promise<boolean>}
 */
export const deletePostById = async ({ postId }) => {
  const post = await getPostById(postId)

  if (
    post.sellerId.toString() !== user._id.toString() &&
    user.rol !== 'admin'
  ) {
    throw new Error('no tienes permiso')
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
    newFavList = [...currentFavs, postId]
  } else {
    newFavList = currentFavs.filter(
      (currentId) => currentId.toString() !== postId.toString()
    )
  }
  await User.updateOne({ _id: user._id }, { favPosts: newFavList })
}
