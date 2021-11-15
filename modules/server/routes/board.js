const { Router } = require('express')
const mongoose = require('mongoose')
const boardService = require('../services/board')
const cardService = require('../services/card')
const Board = require('../schemas/Board')
const Card = require('../schemas/Card')
const User = require('../schemas/User')

const router = Router()

router.get('/boards', async (req, res, next) => {
  try {
    const boards = await Board.find({ deleted: { $exists: false } }).sort(
      'name'
    )
    res.send(boards)
  } catch (err) {
    next(err)
  }
})

router.get('/boards/:slug', async (req, res, next) => {
  try {
    let board = await boardService.getBoardBySlug(req.params.slug)
    if (!board.labels || board.labels.length === 0) {
      board.labels = boardService.defaultLabels
      board = await boardService.updateBoard({
        board: { _id: board._id, labels: board.labels }
      })
    }
    const cards = await Card.find({
      boardId: new mongoose.Types.ObjectId(board._id)
    })
    const members = await boardService.getMembers(board)
    res.send({ board, members, cards })
  } catch (err) {
    next(err)
  }
})

router.put('/boards/:boardId/sections/:sectionId', async (req, res, next) => {
  try {
    await boardService.updateSection({
      boardId: req.params.boardId,
      section: req.request.body.section
    })
    res.send({ success: true })
  } catch (err) {
    next(err)
  }
})

router.post('/boards/:boardId/sections', async (req, res, next) => {
  try {
    const board = await boardService.addSection({
      boardId: req.params.boardId,
      section: { name: req.request.body.name }
    })
    res.send(board.sections[board.sections.length - 1])
  } catch (err) {
    next(err)
  }
})

router.post(
  '/boards/:boardId/sections/:sectionId/cards',
  async (req, res, next) => {
    try {
      const card = await cardService.create({
        title: req.body.title || 'A card',
        boardId: new mongoose.Types.ObjectId(req.params.boardId)
      })

      const board = await Board.findById(req.params.boardId).lean()
      const section = board.sections.filter(
        s => s.id === req.params.sectionId
      )[0]
      section.cards[0].push(card._id)
      const index = board.sections.findIndex(s => s.id === req.params.sectionId)
      await Board.update(
        { _id: new mongoose.Types.ObjectId(req.params.boardId) },
        { $set: { [`sections.${index}`]: section } }
      )

      res.send(card)
    } catch (err) {
      next(err)
    }
  }
)

router.post('/boards', async (req, res, next) => {
  try {
    if (!req.body.name || req.body.name === '') {
      return next(new Error('No name given'))
    }
    const board = await boardService.create({
      name: req.body.name,
      userId: req.user._id.toString()
    })
    res.send({ board })
  } catch (err) {
    next(err)
  }
})

router.delete('/boards/:id', async (req, res, next) => {
  try {
    if (!req.params.id || req.params.id === '') {
      return next(new Error('No board id given'))
    }
    await boardService.remove({
      boardId: req.params.id
    })
    res.send({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
