import { searchMisc } from '../models/miscModels.js'

const searchMiscController = async (req, res) => {
  try {
    const query = req.query
    const results = await searchMisc(query)
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar en misc' })
  }
}

export { searchMiscController }
