import mongoose from 'mongoose'
const UserPostLikeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'likes' }
)
const UserPostLike = mongoose.model('UserPostLike', UserPostLikeSchema)

export default UserPostLike
