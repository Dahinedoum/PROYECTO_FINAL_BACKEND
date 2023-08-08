import mongoose from 'mongoose'
const UserPostLikeSchema = new mongoose.Schema({
  postId: {
    type: String,
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})
const UserPostLike = mongoose.model('UserPostLike', UserPostLikeSchema)

export default UserPostLike
