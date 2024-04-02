import { pool } from '../../../config/index.js'

const create = async ({ email, password, rol, lenguaje }) => {
  const text = `INSERT INTO usuarios
                (email, password, rol, lenguaje)
                VALUES ($1, $2, $3, $4)
                RETURNING id, email, rol, lenguaje`
  const { rows } = await pool.query(text, [email, password, rol, lenguaje])
  return rows[0]
}

const getByEmail = async (email) => {
  const text = 'SELECT * FROM usuarios WHERE email = $1'
  const { rows } = await pool.query(text, [email])
  return rows[0]
}

export { create, getByEmail }
