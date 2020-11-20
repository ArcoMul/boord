const passport = require('passport')
const { Router } = require('express')
const config = require('../lib/config')
const { signup } = require('../services/user')

const callbackURL = `${config.web.url}/auth/slack/callback`

const router = Router()

function auth(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(new Error('no user'))
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      res.send({
        email: user.email,
        name: user.name,
        permissions: user.permissions,
        buckets: user.buckets
      })
    })
  })(req, res, next)
}

router.get(
  '/auth/slack',
  passport.authenticate('slack', {
    callbackURL
  })
)

router.get(
  '/auth/slack/callback',
  passport.authenticate('slack', {
    callbackURL,
    failureRedirect: '/login'
  }),
  (req, res) => {
    console.log('/auth/slack/callback 2')
    res.redirect('/')
  }
)

router.post('/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password, invitationCode } = req.body
    await signup({
      name,
      email,
      password,
      invitationCode
    })
    auth(req, res, next)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/auth/login', (req, res, next) => {
  auth(req, res, next)
})

// router.get('/auth/invite/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params
//     const invitation = await Invitation.findOne({
//       _id: id,
//       isUsed: { $exists: false },
//       validTill: { $gte: new Date() }
//     })
//     res.send({ invitation })
//   } catch (e) {
//     next(e)
//   }
// })

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
