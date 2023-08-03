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
 * @param {"Gluten" | "Crustáceos" | "Huevos" | "Pescado" | "Cacahuetes" | "Soja" | "Lácteos" | "Frutos con cáscara" | "Apio"  | "Mostaza" | "Sésamo" | "Sulfitos" | "Altramuces" | "Moluscos"} data.allergies
 * @param {string} data.description
 * @param {{ name: string, quantity: number, unity: "Litro" | "Mililitro" | "Kilogramos" | "Gramos" | "Libra" | "Onza" | "Tablespoon" | "Cucharada postre" }} data.ingredients
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

  const validPostAllergies = [
    'Gluten',
    'Crustáceos',
    'Huevos',
    'Pescado',
    'Cacahuetes',
    'Soja',
    'Lácteos',
    'Frutos con cáscara',
    'Apio',
    'Mostaza',
    'Sésamo',
    'Sulfitos',
    'Altramuces',
    'Moluscos',
  ]
  if (!validPostAllergies.includes(allergies)) {
    throw new Error('This is not valid allergie')
  }

  //REVISAR ------>
  const validPostIngredientsUnity = [
    'Litro',
    'Mililitro',
    'Kilogramos',
    'Gramos',
    'Libra',
    'Onza',
    'Tablespoon',
    'Tablespoon dessert',
  ]
  if (!validPostIngredientsUnity.includes(ingredients.unity)) {
    throw new Error('This is not valid unity')
  }
  // <------REVISAR

  
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
