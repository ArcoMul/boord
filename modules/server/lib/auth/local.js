const LocalStrategy = require('passport-local').Strategy
const userService = require('../../services/user')

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await userService.login(email, password)
      done(null, user)
    } catch (err) {
      done(err)
    }
  }
)

module.exports = localStrategy
