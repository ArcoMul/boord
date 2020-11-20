// --- file: socket-instance.js --- //
import io from 'socket.io-client'

let connection

export default function(url) {
  if (!connection) {
    connection = io(url)
  }
  return connection
}
