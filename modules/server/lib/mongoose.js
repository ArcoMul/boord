const mongoose = require('mongoose')
const config = require('./config')

let db

mongoose.connect(config.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.Promise = global.Promise

mongoose.connection.on('connected', () => {
  console.log('Mongoose: connected')
  db = mongoose.connection.db
})
mongoose.connection.on('error', err => {
  console.log('Mongoose: error connecting to mongo database:', err)
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose: disconnected')
})

module.exports = { mongoose, db }
