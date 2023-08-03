import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    mainImage: {
      type: String,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Salad', 'Dessert', 'Breakfast'],
    },
    duration: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Difficult'],
    },
    allergies: {
      type: String,
      enum: [
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
      ],
    },
    description: {
      type: String,
    },
    ingredients: {
      name: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      unity: {
        type: String,
        enum: [
          'Litro',
          'Mililitro',
          'Kilogramos',
          'Gramos',
          'Libra',
          'Onza',
          'Tablespoon',
          'Tablespoon dessert',
        ],
      },
    },
    dinners: {
      type: Number,
    },
    steps: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      order: {
        type: Number,
      },
      image: {
        type: [String],
      },
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'posts' }
)

const Post = mongoose.model('Post', PostSchema)

export default Post











