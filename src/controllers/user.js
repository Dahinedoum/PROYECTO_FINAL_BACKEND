import bcrypt from 'bcrypt'
import User from '../models/user.js'
import UserPostLike from '../models/user_post_like.js'

/**
 * @param {object} user
 * @returns {Promise<object>}
 */

export const getAllUsers = async ({ filters, user }) => {
  if (!user) {
    throw new Error('You need to have an account to view this list')
  }
  const filtersData = {}
  if (filters) {
    if (filters.username) {
      filtersData.username = { $regex: filters.username }
    }
  }
  return User.find()
}

/**
 *
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getUserById = async (id) => {
  const user = await User.findOne({ _id: id })
    .populate('favPosts')
    .populate('following')
    .populate('sharedPosts')

  if (!user) {
    throw new Error('User not found')
  }
  const likes = await UserPostLike.find({ userId: user._id }).select('postId')

  const likePosts = likes.map((like) => like.postId)

  const followers = await getFollowersByUser(user._id)

  const following = await getFollowingUsers(user._id)

  return {
    ...user.toObject(),
    likePosts: likePosts,
    followers: followers,
    following: following,
  }
}

/**
 *
 * @param {string} id
 * @param {object} user
 * @returns {Promise<object>}
 */

export const updateUserInfo = async ({ user, data }) => {
  if (data.email) {
    const existedEmail = await User.findOne({
      email: data.email,
      _id: { $not: user._id },
    })

    if (existedEmail) {
      throw new error('this email is in use')
    }

    user.email = data.email
  }

  if (data.password) {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)

    const hashedPassword = await bcrypt.hash(data.password, salt)

    const existingPassword = await bcrypt.compare(data.password, user.password)

    if (existingPassword) {
      throw new Error(`The password can't be the same as before`)
    }

    user.password = hashedPassword
  }

  if (data.username) {
    user.username = data.username
  }

  if (data.firstName) {
    user.firstName = data.firstName
  }

  if (data.lastName) {
    user.lastName = data.lastName
  }

  if (data.age) {
    user.age = data.age
  }

  const validUserGender = ['male', 'female', 'non-binary']
  if (data.gender && !validUserGender.includes(data.gender)) {
    throw new Error(
      `You need to type one of the following genders: ${validUserGender.join(
        ','
      )}`
    )
  } else {
    user.gender = data.gender
  }

  if (data.biography) {
    user.biography = data.biography
  }

  if (data.avatar) {
    user.avatar = data.avatar
  }

  if (data.city) {
    user.city = data.city
  }

  if (data.country) {
    user.country = data.country
  }

  await user.save()

  return user
}

/**
 *
 * @param {string} id
 * @param {object} user
 * @returns {Promise<boolean>}
 */

export const removeUserById = async (id, user) => {
  if (user._id.toString() !== id.toString()) {
    throw new Error(`You don't have permission for this`)
  }
  await User.deleteOne({ _id: id })

  return true
}

//Followers controller

/**
 *
 * @param {string} userId
 * @returns {Promise<object[]>}
 */

export const getFollowersByUser = async (userId) => {
  const followers = await User.find({ following: userId })
  return followers
}

// Following controller

/**
 *
 * @param {string} userId
 * @param {object} user
 * @param {string} user._id
 * @param {object[]} user.following
 */

export const toggleFollowingByUser = async (userId, user) => {
  if (!userId) {
    throw new Error('Id is required')
  }

  if (!user) {
    throw new Error('You need to have an account')
  }

  const followingUser = await getUserById(userId)

  const currentFollowingUsers = user.following || []

  //checkin if the user is already followed

  const isAlreadyFollowing = currentFollowingUsers.find(
    (currentId) => currentId.toString() === userId.toString()
  )

  let newFollowingList = []

  if (!isAlreadyFollowing) {
    //Adding the new user to the following/follower list
    newFollowingList = [...currentFollowingUsers, followingUser._id]
    await User.updateOne(
      { _id: userId },
      { $addToSet: { followers: user._id } }
    )
  } else {
    //Removing the user from the following/follower list
    newFollowingList = currentFollowingUsers.filter(
      (currentId) => currentId.toString() !== userId.toString()
    )
    await User.updateOne({ _id: userId }, { $pull: { followers: user._id } })
  }

  await User.updateOne({ _id: user._id }, { following: newFollowingList })
}

export const getFollowingUsers = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    const user = await User.findOne({ _id: userId })

    if (!user) {
      throw new Error('User not found')
    }

    return user.following
  } catch (error) {
    throw new Error('Error fetching following list: ' + error.message)
  }
}
