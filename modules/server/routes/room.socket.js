module.exports = function roomSocket(io, socket) {
  socket.on('joinRoom', ({ name }) => {
    socket.leaveAll()
    socket.join(name)
  })
}
