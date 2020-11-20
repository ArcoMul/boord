const SlackStrategy = require('@aoberoi/passport-slack')
const User = require('../../schemas/User')
const config = require('../config')

const slackStrategy = function() {
  return
  new SlackStrategy.default.Strategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scope: ['identity.basic', 'identity.email', 'identity.avatar']
    },
    async (
      accessToken,
      scopes,
      team,
      { bot, incomingWebhook },
      { user: userProfile, team: teamProfile },
      done
    ) => {
      let user
      user = await User.findOne({ slackId: userProfile.id })
      if (!user) {
        user = await User.create({
          name: userProfile.name,
          email: userProfile.email,
          avatar: userProfile.image_192,
          slackId: userProfile.id,
          permissions: ['user', 'admin']
        })
      } else if (!user.email) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              email: userProfile.email,
              avatar: userProfile.image_192
            }
          },
          {
            new: true
          }
        )
      }
      return done(null, user)
    }
  )
}

module.exports = slackStrategy
