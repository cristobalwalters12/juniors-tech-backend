import { create, getById, getAll, update } from '../models/postModels.js'

const createPost = async (req, res) => {
  const data = await create({ ...req.body, currUserId: req.user.id })
  res.status(201).json({
    status: 'success',
    data
  })
}

const getPostById = async (req, res) => {
  const data = await getById({ postId: req.params.id, currUserId: req.user.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const getPosts = async (req, res) => {
  const data = await getAll({ currUserId: req.user.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const editPostById = async (req, res) => {
  const data = await update({ postId: req.params.id, ...req.body })
  res.status(200).json({
    status: 'success',
    data
  })
}

export { createPost, getPostById, getPosts, editPostById }
