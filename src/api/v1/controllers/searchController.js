import { getPostsByQuery } from '../models/postModel.js'
import { searchModel } from '../models/searchModel.js'

const searchController = async (req, res) => {
  try {
    const query = req.query
    const results = await searchModel(query)
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    if (error.message === 'Solo se puede buscar un tipo de dato a la vez') {
      res.status(400).json({ message: 'Error: Solo se puede buscar un tipo de dato a la vez' })
    } else {
      res.status(500).json({ message: 'Error al buscar en misc' })
    }
  }
}

const searchPosts = async (req, res) => {
  const currUserId = req?.resource?.user?.id
  const { total, page, limit, posts } = await getPostsByQuery({ ...req.query, currUserId })
  const totalPages = Math.ceil(total / limit)
  const prevPage = page <= 1 ? null : page - 1
  const nextPage = page >= totalPages ? null : page + 1
  res.status(200).json({
    status: 'success',
    data: {
      posts,
      limit,
      totalMatches: total,
      totalPages,
      nextPage,
      currPage: page,
      prevPage
    }
  })
}

export { searchController, searchPosts }
