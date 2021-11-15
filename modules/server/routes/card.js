const { Router } = require('express')
const mongoose = require('mongoose')
const cardService = require('../services/card')
const Card = require('../schemas/Card')

const router = Router()

router.get('/cards/last-updated', async (req, res, next) => {
  try {
    const cards = await cardService.getLastUpdatedCards()
    res.send(cards)
  } catch (err) {
    next(err)
  }
})

router.get('/cards/:id', async (req, res, next) => {
  try {
    const card = await Card.findOneById(req.params.id)
    res.send(card)
  } catch (err) {
    next(err)
  }
})

router.put('/cards/:id', async (req, res, next) => {
  try {
    const card = req.body
    await Card.update(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $set: card }
    )
    res.send(card)
  } catch (err) {
    next(err)
  }
})

router.get('/board/:id/cards', async (req, res, next) => {
  try {
    const board = await Card.findOneById(req.params.id)
    res.send(board)
  } catch (err) {
    next(err)
  }
})

router.get('/create-card', async (req, res, next) => {
  try {
    const card = await cardService.create({
      title: req.query.title || 'A card',
      boardId: new mongoose.Types.ObjectId(req.query.board)
    })
    res.send(card)
  } catch (err) {
    next(err)
  }
})

module.exports = router
