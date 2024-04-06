import { ALLOWED_ORIGIN, PORT } from './envs.js'

const whiteList = [ALLOWED_ORIGIN, `http://localhost:${PORT}`]

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
