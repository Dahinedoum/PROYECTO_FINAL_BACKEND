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
    },
    lastName: {
      type: String,
    },
    age: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary'],
    },
    biography: {
      type: String,
    },
    avatar: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    createdAt: {
      type: Date,
      require: true,
      default: Date.now,
    },
    favPosts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    followers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { collection: 'users' }
)

const User = mongoose.model('User', UserSchema)

export default User
