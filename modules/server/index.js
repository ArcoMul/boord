const path = require('path')
const http = require('http')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const connectMongo = require('connect-mongo')
const session = require('express-session')
const socket = require('socket.io')
const _ = require('lodash')

const { mongoose } = require('./lib/mongoose')

const User = require('./schemas/User')

const slackStrategy = require('./lib/auth/slack')
const localStrategy = require('./lib/auth/local')

const cardSocket = require('./routes/card.socket')
const boardSocket = require('./routes/board.socket')
const roomSocket = require('./routes/room.socket')

const config = require('./lib/config')

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000

module.exports = function ExpressModule() {
  this.nuxt.hook('render:before', renderer => {
    const _routesPath = './routes'

    const app = express()
    const routesPath = path.join(__dirname, _routesPath)

    const server = http.createServer(this.nuxt.renderer.app)
    const io = socket(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => {
      console.log(`listen on port ${port || PORT} at host ${host || HOST}`)
      return new Promise(resolve =>
        server.listen(port || PORT, host || HOST, resolve)
      )
    }
    // close this server on 'close' event
    this.nuxt.hook('close', () => server.close())

    io.on('connection', function(socket) {
      cardSocket(io, socket)
      boardSocket(io, socket)
      roomSocket(io, socket)
    })

    app.use(bodyParser.json())

    // Session
    const MongoStore = connectMongo(session)
    app.use(
      session({
        secret:
          'dsajkfljk23;rjvljfljafl;sdajf2k1j;lfriojf3jlwekfjaslfjsdl;fsdafjsd',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // one month
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
    )

    app.use((req, res, next) => {
      req.config = _.pick(config, ['web'])
      next()
    })

    // Setup passport, save whole user in session, for now
    passport.serializeUser((user, done) => {
      done(null, user._id)
    })
    passport.deserializeUser((_id, done) => {
      User.findById(_id)
        .lean()
        .exec((err, user) => {
          done(err, user)
        })
    })
    if (process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET) {
      passport.use(slackStrategy())
    }
    passport.use(localStrategy)
    app.use(passport.initialize())
    app.use(passport.session())

    // Disable all caching for routes reaching till here (not static files)
    // so that we are sure when content is being pushed from the client
    // that it is the latest version
    app.set('etag', false)
    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      next()
    })

    // Routes
    app.use('', require(routesPath))

    app.use(function(err, req, res, next) {
      console.error(err.stack)
      res.status(500).send({ error: { message: err.message } })
    })

    this.addServerMiddleware(app)
  })
}
