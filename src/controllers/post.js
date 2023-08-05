import Post from '../models/post.js'

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
 * @param {number} data.dinners
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
    dinners,
    steps,
  } = data

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

  if (dinners) {
    post.dinners = dinners
  }

  if (description) {
    post.description = description
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
    dinners,
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
export const updatePost = async ({ id, data, user }) => {
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
    dinners,
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

  if (dinners) {
    post.dinners = dinners
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
