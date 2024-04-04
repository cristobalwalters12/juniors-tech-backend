import { pool } from '../../../config/dbConnection.js'

const searchMisc = async (query) => {
  const { country, technology, language } = query
  const results = []

  if (country) {
    const countryResult = await pool.query('SELECT id, name FROM country WHERE name ILIKE $1', [`%${country}%`])
    results.push(...countryResult.rows)
  }

  if (technology) {
    const technologyResult = await pool.query('SELECT id, name FROM technology WHERE name ILIKE $1', [`%${technology}%`])
    results.push(...technologyResult.rows)
  }

  if (language) {
    const languageResult = await pool.query('SELECT id, name FROM language WHERE name ILIKE $1', [`%${language}%`])
    results.push(...languageResult.rows)
  }

  return results
}

export { searchMisc }
