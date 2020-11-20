const { Router } = require('express')
const router = Router()

const auth = require('./auth.js')
const board = require('./board.js')
const card = require('./card.js')
const user = require('./user.js')

router.use('/', auth)
router.use('/api/', board)
router.use('/api/', card)
router.use('/api/', user)

module.exports = router
