import 'dotenv/config'
import pg from 'pg'

import { host, user, password, port, database } from '../config/envs.js'
const pool = new pg.Pool({
  user,
  password,
  host,
  port,
  database,
  allowExitOnIdle: true
})

export { pool }
