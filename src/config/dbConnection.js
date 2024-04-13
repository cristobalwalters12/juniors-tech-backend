import 'dotenv/config'
import pg from 'pg'

import { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD, DATABASE_URL } from '../config/envs.js'

let pool

if (process.env.NODE_ENV === 'production') {
  pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  pool = new pg.Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    allowExitOnIdle: true
  })
}

export { pool }
