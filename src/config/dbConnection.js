import 'dotenv/config'
import pg from 'pg'

import { DATABASE_URL } from '../config/envs.js'
const pool = new pg.Pool({
  connectionString: DATABASE_URL
})

export { pool }
