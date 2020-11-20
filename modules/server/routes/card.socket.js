const mongoose = require('mongoose')
const boardService = require('../services/board')
const cardService = require('../services/card')
const Card = require('../schemas/Card')

module.exports = function cardSocket(io, socket) {
  socket.on('addCard', async ({ card: _card, boardId, sectionId }) => {
    const card = await cardService.create({ ..._card, boardId })
    const board = await boardService.addCard({
      boardId,
      sectionId,
      cardId: card._id
    })
    io.to(`board-${boardId}`).emit('addCard', card)
    io.to(`board-${boardId}`).emit('updateBoard', board)
  })

  socket.on('updateCard', async card => {
    const _card = await Card.findByIdAndUpdate(
      card._id,
      { $set: card },
      { new: true }
    )
    socket.to(`board-${card.boardId}`).emit('updateCard', _card)
  })

  socket.on('removeCard', async ({ card, boardId }) => {
    const _card = await Card.findByIdAndUpdate(
      new mongoose.Types.ObjectId(card._id),
      { $set: { deleted: new Date() } },
      { new: true }
    )
    const board = await boardService.removeCard({ cardId: card._id, boardId })
    io.to(`board-${card.boardId}`).emit('removeCard', { card: _card, board })
  })
}
