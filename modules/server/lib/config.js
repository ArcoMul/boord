const configuratoror = require('configuratoror')

const options = {
  folder: './etc'
}
const yippConfig = process.env.YIPP_CONFIG
const env = process.env.NODE_ENV

if (!yippConfig) {
  throw new Error(
    'No YIPP_CONFIG given, define YIPP_CONFIG=<environment> before running server'
  )
}

console.log(`Running with config: ${yippConfig}`)

const config = configuratoror(options)(yippConfig)
config.env = env

module.exports = config
