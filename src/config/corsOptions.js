import { ALLOWED_ORIGIN } from './envs.js'

const whiteList = [ALLOWED_ORIGIN]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      return callback(null, origin)
    }
    // eslint-disable-next-line n/no-callback-literal
    return callback(`CORS Error: origin ${origin} not allowed`)
  },
  credentials: true
}

export { corsOptions }
