import { getPagination } from '../../helpers/getPagination.js'
import { getPostsByQuery } from '../models/postModel.js'
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

const searchPosts = async (req, res) => {
  const currUserId = req?.resource?.user?.id
  const { posts, ...result } = await getPostsByQuery({ ...req.query, currUserId })
  const pagination = getPagination(result)
  res.status(200).json({
    status: 'success',
    data: {
      posts,
      ...pagination
    }
  })
}

export { searchController, searchPosts }
