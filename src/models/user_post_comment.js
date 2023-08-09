import mongoose from 'mongoose'
const UserPostCommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: String,
      require: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserPostComment',
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: 'comments' }
)
const UserPostComment = mongoose.model('UserPostComment', UserPostCommentSchema)

export default UserPostComment
