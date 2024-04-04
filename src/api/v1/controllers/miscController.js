import { searchMisc } from '../models/miscModels.js'

const searchMiscController = async (req, res) => {
  try {
    let { country, technology, language } = req.body
    country = country ? country.charAt(0).toUpperCase() + country.slice(1).toLowerCase() : country
    language = language ? language.charAt(0).toUpperCase() + language.slice(1).toLowerCase() : language
    technology = technology ? technology.charAt(0).toUpperCase() + technology.slice(1).toLowerCase() : technology
    const query = { country, technology, language }
    const results = await searchMisc(query)
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar en misc' })
  }
}
export { searchMiscController }
