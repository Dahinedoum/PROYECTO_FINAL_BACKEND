import User from '../models/user.js'
import bcrypt from 'bcrypt'

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

  // TODO investigar como se hacer un reset password
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
