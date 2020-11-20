const bcrypt = require('bcrypt')
const User = require('../schemas/User')

async function signup({ name, email, password, invitationCode }) {
  const existing = await User.findOne({ email })
  if (existing) {
    throw new Error('email in use')
  }

  const _user = {
    name,
    email,
    buckets: null,
    permissions: ['user']
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  _user.password = hashedPassword

  const user = await User.create(_user)
  return user
}

async function login(email, password) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('unknown user')
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('incorrect password')
  }
  return user
}

module.exports = { signup, login }
