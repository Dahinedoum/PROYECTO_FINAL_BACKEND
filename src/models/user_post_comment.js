import mongoose from 'mongoose'
const UserPostCommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    postId: {
      type: String,
    },
    comment: {
      type: String,
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
