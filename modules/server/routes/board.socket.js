const User = require('../schemas/User')
const boardService = require('../services/board')

module.exports = function boardSocket(io, socket) {
  socket.on(
    'moveCard',
    async ({
      boardId,
      sectionId,
      columnIndex,
      removedIndex,
      addedIndex,
      cardId
    }) => {
      try {
        const board = await boardService.moveCard({
          boardId,
          sectionId,
          columnIndex,
          removedIndex,
          addedIndex,
          cardId
        })
        io.to(`board-${board._id}`).emit('updateBoard', board)
      } catch (err) {
        throw err
      }
    }
  )

  socket.on('updateBoard', async ({ board: _board }) => {
    try {
      const board = await boardService.updateBoard({ board: _board })
      socket.to(`board-${board._id}`).emit('updateBoard', board)
    } catch (err) {
      throw err
    }
  })

  socket.on('addSection', async ({ boardId, section }) => {
    try {
      const board = await boardService.addSection({ boardId, section })
      io.to(`board-${boardId}`).emit('updateBoard', board)
    } catch (err) {
      throw err
    }
  })

  socket.on('removeSection', async ({ boardId, sectionId }) => {
    try {
      const board = await boardService.removeSection({ boardId, sectionId })
      io.to(`board-${boardId}`).emit('updateBoard', board)
    } catch (err) {
      throw err
    }
  })

  socket.on('addBoardMember', async ({ boardId, email }) => {
    const board = await boardService.addMemberByEmail(boardId, email)
    const members = await User.find({ _id: { $in: board.members } }).lean()
    io.to(`board-${boardId}`).emit('updateBoard', board)
    io.to(`board-${boardId}`).emit('updateMembers', members)
  })

  socket.on('removeBoardMember', async ({ boardId, userId }) => {
    const board = await boardService.removeMember(boardId, userId)
    const members = await boardService.getMembers(board)
    io.to(`board-${boardId}`).emit('updateBoard', board)
    io.to(`board-${boardId}`).emit('updateMembers', members)
  })
}
