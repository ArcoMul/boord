module.exports = {
  _extends: 'common',
  database: {
    url: 'mongodb://mongodb:27017/boord-production'
  },
  web: {
    url: `https://${process.env.VIRTUAL_HOST}`
  }
}
