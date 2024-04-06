import { searchModel } from '../models/searchModel.js'

const searchController = async (req, res) => {
  try {
    const query = req.query
    const results = await searchModel(query)
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar en misc' })
  }
}

export { searchController }
