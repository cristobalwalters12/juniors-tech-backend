import 'dotenv/config'

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = [
  process.env.ALLOWED_ORIGIN,
  process.env.ALLOWED_ORIGIN2
]
const CORS_ALLOW_ALL = process.env.CORS_ALLOW_ALL === 'true'
const DATABASE_URL = process.env.DATABASE_URL
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

export {
  NODE_ENV,
  PORT,
  ALLOWED_ORIGIN,
  ACCESS_TOKEN_SECRET,
  DATABASE_URL,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  CORS_ALLOW_ALL
}
