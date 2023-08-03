import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    mainImage: {
      type: String,
    },
    tittle: {
      type: String,
    },
    duration: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'difficult'],
    },
    allergies: {
      type: String,
      enum: [
        'gluten',
        'crustáceos',
        'huevos',
        'pescado',
        'cacahuetes',
        'soja',
        'lácteos',
        'frutos con cáscara',
        'apio',
        'mostaza',
        'sésamo',
        'sulfitos',
        'altramuces',
        'moluscos',
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
        enum: ['Litro', 'Mililitro', 'Kilogramos', 'Gramos', 'Libra', 'Onza', 'Cucharada sopera', 'Cucharada postregit'],
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











