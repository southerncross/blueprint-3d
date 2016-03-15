import log from './log'

// default environment to `development`
const env = process.env.NODE_ENV || 'development'

log.info(`Using ${env} environment...`)

let configs = {}

if (env === 'development') {
  configs = {
    env: 'development',
    port: 4400,
    psql: {
      host: 'localhost',
      db: 'blueprint-dev',
      user: 'lishunyang',
      password: ''
    }
  }
} else if (env === 'production') {
  configs = {
    env: 'production',
    port: process.env.PORT,
    psql: {
      host: process.env.SQL_HOST,
      db: process.env.SQL_DB,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD
    }
  }
}

export default configs
