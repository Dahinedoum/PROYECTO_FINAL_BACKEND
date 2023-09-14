import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    mainImage: {
      type: String,
    },
    title: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: [
        'Salad',
        'Dessert',
        'Breakfast',
        'Chinese',
        'Japanese',
        'Mediterranean',
        'Thai',
        'American',
        'Vegan',
        '',
      ],
    },
    duration: {
      type: Number,
      require: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Intermediate', 'Advanced', ''],
    },
    allergies: [
      {
        type: String,
        require: true,
        enum: [
          'Gluten',
          'Crustaceans',
          'Eggs',
          'Fish',
          'Peanuts',
          'Soy',
          'Dairy',
          'Nuts',
          'Celery',
          'Mustard',
          'Sesame',
          'Sulphites',
          'Lupins',
          'Mollusks',
        ],
      },
    ],
    description: {
      type: String,
    },
    ingredients: [
      {
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
            'Milliliters',
            'Kilograms',
            'Grams',
            'Pound',
            'Ounce',
            'Tablespoon',
            'Tablespoon dessert',
          ],
        },
      },
    ],
    diners: {
      type: Number,
    },
    steps: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        order: {
          type: Number,
        },
      },
    ],
    createdAt: {
      type: Date,
      require: true,
      default: Date.now,
    },
  },
  { collection: 'posts' }
)

const Post = mongoose.model('Post', PostSchema)

export default Post
