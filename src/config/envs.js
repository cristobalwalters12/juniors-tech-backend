import 'dotenv/config'

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

const DATABASE_URL = process.env.DATABASE_URL
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

export {
  NODE_ENV,
  PORT,
  ALLOWED_ORIGIN,
  ACCESS_TOKEN_SECRET,
  DATABASE_URL
}
