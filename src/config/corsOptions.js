import { ALLOWED_ORIGIN, PORT, CORS_ALLOW_ALL } from './envs.js'

const whiteList = [ALLOWED_ORIGIN, `http://localhost:${PORT}`]

const corsOptions = {
  origin: function (origin, callback) {
    if (CORS_ALLOW_ALL || !origin || whiteList.includes(origin)) {
      return callback(null, origin)
    }
    // eslint-disable-next-line n/no-callback-literal
    return callback(`CORS Error: origin ${origin} not allowed`)
  },
  credentials: true
}

export { corsOptions }
