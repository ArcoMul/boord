const { Router } = require('express')
const User = require('../schemas/User')

const router = Router()

router.get('/users', async (req, res, next) => {
  try {
    const user = await User.find({}).lean()
    res.send(user)
  } catch (err) {
    next(err)
  }
})

module.exports = router
