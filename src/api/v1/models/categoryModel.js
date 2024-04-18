import { pool } from '../../../config/dbConnection.js'
import { getUUID } from '../../../config/adapters/uuidAdapter.js'

const getCategories = async (page, size) => {
  const offset = (page - 1) * size

  const countQuery = {
    text: 'SELECT COUNT(*) FROM category'
  }
  const countResponse = await pool.query(countQuery)
  const total = parseInt(countResponse.rows[0].count)

  const dataQuery = {
    text: 'SELECT * FROM category ORDER BY id LIMIT $1 OFFSET $2',
    values: [size, offset]
  }
  const dataResponse = await pool.query(dataQuery)

  const prev = page > 1 ? page - 1 : null
  const next = total > size * page ? page + 1 : null

  return {
    data: dataResponse.rows,
    size,
    page,
    prev,
    next
  }
}

const createNewCategory = async (category) => {
  const id = getUUID()

  const checkQuery = {
    text: 'SELECT * FROM category WHERE name = $1',
    values: [category.name]
  }
  const checkResponse = await pool.query(checkQuery)
  if (checkResponse.rows.length > 0) {
    throw new Error('La categoría ya existe')
  }

  const query = {
    text: 'INSERT INTO category  (id,name) VALUES ($1,$2) RETURNING *',
    values: [id, category.name]
  }
  const response = await pool.query(query)
  return response.rows[0]
}

const deleteCategory = async (id) => {
  const checkQuery = {
    text: 'SELECT * FROM category WHERE id = $1',
    values: [id]
  }
  const checkResponse = await pool.query(checkQuery)
  if (checkResponse.rows.length === 0) {
    throw new Error('La categoría no existe')
  }

  if (checkResponse.rows[0].name === 'otros') {
    throw new Error('La categoría "otros" no puede ser eliminada')
  }

  const updateQuery = {
    text: 'UPDATE aspect SET category_id = $1 WHERE category_id = $2',
    values: ['8un-bW2jrj', id]
  }
  await pool.query(updateQuery)

  const deleteQuery = {
    text: 'DELETE FROM category WHERE id = $1',
    values: [id]
  }
  await pool.query(deleteQuery)
}
const updateCategories = async (id, category) => {
  const checkQuery = {
    text: 'SELECT * FROM category WHERE id = $1',
    values: [id]
  }
  const checkResponse = await pool.query(checkQuery)
  if (checkResponse.rows.length === 0) {
    throw new Error('La categoría no existe')
  }
  const query = {
    text: 'UPDATE category SET name = $1 WHERE id = $2 RETURNING *',
    values: [category.name, id]
  }
  const response = await pool.query(query)
  return response.rows[0]
}
export { getCategories, createNewCategory, deleteCategory, updateCategories }
