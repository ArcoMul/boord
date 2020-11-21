const configuratoror = require('configuratoror')

const options = {
  folder: './etc'
}
const selectedConfig = process.env.CONFIG
const env = process.env.NODE_ENV

if (!selectedConfig) {
  throw new Error(
    'No YIPP_CONFIG given, define YIPP_CONFIG=<environment> before running server'
  )
}

console.log(`Running with config: ${selectedConfig}`)

const config = configuratoror(options)(selectedConfig)
config.env = env

module.exports = config
