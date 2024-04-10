import 'dotenv/config'
import pg from 'pg'

import { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } from '../config/envs.js'
const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  allowExitOnIdle: true
})

export { pool }
