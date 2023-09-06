import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * @param {string} email
 * @param {string} password
 * @return {Promise<string>}
 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please provide both email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  const matchedPassword = bcrypt.compare(password, user.password)

  if (!matchedPassword) {
    throw new Error('Invalid password')
  }

  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @param {string} firstName
 * @param {string} lastName
 * @param {Number} age
 * @param {string} country
 * @param {'male' | 'female' |'non-binary'} gender
 * @return {Promise<string>}
 */

export const signup = async ({
  email,
  password,
  username,
  firstName,
  lastName,
  age,
  country,
  gender,
  biography,
}) => {
  if (
    !email ||
    !password ||
    !username ||
    !firstName ||
    !age ||
    !country ||
    !gender
  ) {
    throw new Error('Some fields are missing')
  }

  const hasUser = await User.findOne({ email })

  if (hasUser) {
    throw new Error('Email already has been used')
  }

  const hasUsername = await User.findOne({ username })

  if (hasUsername) {
    throw new Error('This Username already has been used')
  }

  if (age && typeof age !== 'number') {
    throw new Error('Please provide a valid age')
  }

  if (firstName && firstName.length < 2) {
    throw new Error('First name must be 2 characters or longer')
  }

  if (lastName && lastName.length < 2) {
    throw new Error('Last name must be 2 characters or longer')
  }

  if (country && typeof country !== 'string') {
    throw new Error('Please select a country')
  }

  if (biography && typeof biography !== 'string') {
    throw new Error('Please put your biography')
  }

  const validGender = ['male', 'female', 'non-binary']
  if (gender && !validGender.includes(gender)) {
    throw new Error('Please select a valid gender')
  }

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)

  const hashedPassword = await bcrypt.hash(password, salt)
  const user = new User({
    email,
    password: hashedPassword,
    username,
    firstName,
    lastName,
    age,
    country,
    gender,
    biography,
  })

  await user.save()

  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}
