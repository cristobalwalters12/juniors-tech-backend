import { getPagination } from '../../helpers/getPagination.js'
import { getPostsByQuery } from '../models/postModel.js'
import { searchModel } from '../models/searchModel.js'
import { getUsersByQuery } from '../models/userModel.js'

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

const searchUsers = async (req, res) => {
  const { users, ...result } = await getUsersByQuery({ ...req.query })
  const pagination = getPagination(result)
  res.status(200).json({
    status: 'success',
    data: {
      users,
      ...pagination
    }
  })
}

export { searchController, searchPosts, searchUsers }
