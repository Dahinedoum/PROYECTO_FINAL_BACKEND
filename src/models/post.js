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
      required: true,
    },
    type: {
      type: String,
      enum: ['Salad', 'Dessert', 'Breakfast'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Difficult'],
    },
    allergies: {
      type: String,
      enum: [
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
          'Liter',
          'Milliliter',
          'Kilograms',
          'Grams',
          'Pound',
          'Ounce',
          'Tablespoon',
          'Tablespoon dessert',
        ],
      },
      required: true,
    },
    diners: {
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
      required: true,
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











