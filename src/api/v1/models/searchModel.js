import { pool } from '../../../config/dbConnection.js'

const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const searchModel = async (query) => {
  const fields = [
    'country',
    'technology',
    'language',
    'aspectType',
    'education',
    'employmentStatus',
    'itField',
    'pronoun',
    'role',
    'socialNetwork',
    'reportAction',
    'reportReason',
    'reportType'
  ]

  const data = []

  let searchFieldsCount = 0
  for (const field of fields) {
    if (query[field]) {
      searchFieldsCount++
      if (searchFieldsCount > 1) {
        throw new Error('Solo se puede buscar un tipo de dato a la vez')
      }
      const snakeCaseField = toSnakeCase(field)
      const result = await pool.query(`SELECT id, name FROM ${snakeCaseField} WHERE name ILIKE $1`, [`%${query[field]}%`])
      data.push(...result.rows)
    }
  }

  return data
}

export { searchModel }
