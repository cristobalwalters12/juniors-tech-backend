import { pool } from '../../../config/dbConnection.js'

const searchMisc = async (query) => {
  const { country, technology, language } = query
  const data = []
  if (country) {
    const countryResult = await pool.query('SELECT id, name FROM country WHERE name LIKE $1', [`%${country}%`])
    data.push(...countryResult.rows)
  }
  if (technology) {
    const technologyResult = await pool.query('SELECT id, name FROM technology WHERE name LIKE $1', [`%${technology}%`])
    data.push(...technologyResult.rows)
  }
  if (language) {
    const languageResult = await pool.query('SELECT id, name FROM language WHERE name LIKE $1', [`%${language}%`])
    data.push(...languageResult.rows)
  }

  return data
}

export { searchMisc }
