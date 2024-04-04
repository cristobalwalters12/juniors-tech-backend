import { create, getById, getAll, update, deleteById, voteById } from '../models/postModel.js'

const createPost = async (req, res) => {
  const data = await create({ ...req.body, currUserId: req.user.id })
  res.status(201).json({
    status: 'success',
    data
  })
}

const getPostById = async (req, res) => {
  const data = await getById({ postId: req.params.id, currUserId: req?.user?.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const getPosts = async (req, res) => {
  const data = await getAll({ currUserId: req?.user?.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const editPostById = async (req, res) => {
  const data = await update({ postId: req.params.id, ...req.body, currUserId: req.user.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const deletePostById = async (req, res) => {
  await deleteById({ postId: req.params.id })
  res.sendStatus(204)
}

const votePostById = async (req, res) => {
  const data = await voteById({
    postId: req.params.id,
    authorId: req.resource.authorId,
    currUserId: req.user.id,
    ...req.body
  })
  res.status(200).json({
    status: 'success',
    data
  })
}

export { createPost, getPostById, getPosts, editPostById, deletePostById, votePostById }
