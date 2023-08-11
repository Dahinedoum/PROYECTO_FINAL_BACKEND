import User from '../models/user.js'

/**
 * @param {object} user
 * @returns {Promise<object>}
 */

export const getAllUsers = async (user) => {
  if (!user) {
    throw new Error('You need to have an account to view this list')
  }

  return User.find()
}

/**
 *
 * @param {string} id
 * @returns {Promise<object>}
 */

export const getUserById = async (id) => {
  const user = await User.findOne({ _id: id }).populate('favPosts')

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 *
 * @param {string} id
 * @param {object} user
 * @returns {Promise<object>}
 */

//TODO arreglar update

export const updateUserInfoById = async ({ user, data }) => {
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

  // TODO investigar como se hacer un reset password
  // if (data.password) {
  //   currentUser.password = user.password
  // }

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
  if (user.gender && !validUserGender.includes(user.gender)) {
    throw new Error(
      `You need to type one of the following genders: ${validUserGender.join(
        ','
      )}`
    )
  } else {
    currentUser.gender = user.gender
  }

  if (user.biography) {
    currentUser.biography = user.biography
  }

  if (user.avatar) {
    currentUser.avatar = user.avatar
  }

  if (user.city) {
    currentUser.city = user.city
  }

  if (user.country) {
    currentUser.country = user.country
  }

  await currentUser.save()

  return currentUser
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
