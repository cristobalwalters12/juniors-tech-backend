import { create, getById, getAll } from '../models/postModels.js'

const createPost = async (req, res) => {
  const data = await create(req.body)
  res.status(201).json({
    status: 'success',
    data
  })
}

const getPostById = async (req, res) => {
  const data = await getById({ postId: req.params.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const getPosts = async (req, res) => {
  const data = await getAll()
  res.status(200).json({
    status: 'success',
    data
  })
}

export { createPost, getPostById, getPosts }
