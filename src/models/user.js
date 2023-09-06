import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      require: true,
    },
    gender: {
      type: String,
      require: true,
      enum: ['male', 'female', 'non-binary'],
    },
    biography: {
      type: String,
    },
    country: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      require: true,
      default: Date.now,
    },
    favPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    sharedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { collection: 'users' }
)

const User = mongoose.model('User', UserSchema)

export default User
