import 'dotenv/config'

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const port = process.env.DB_PORT
const database =
  process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_NAME
    : process.env.DB_NAME
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

export {
  NODE_ENV,
  PORT,
  ALLOWED_ORIGIN,
  ACCESS_TOKEN_SECRET,
  host,
  user,
  password,
  port,
  database
}
