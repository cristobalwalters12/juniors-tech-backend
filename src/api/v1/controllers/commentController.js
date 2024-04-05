import { create, getAll } from '../models/commentModel.js'

const createComment = async (req, res) => {
  const data = await create({
    postId: req.params.postId,
    currUserId: req.user.id,
    ...req.body
  })

  res.status(201).json({
    status: 'success',
    data
  })
}

const getComments = async (req, res) => {
  const data = await getAll({
    postId: req.params.postId,
    currUserId: req.user.id
  })

  res.status(200).json({
    status: 'success',
    data
  })
}

export { createComment, getComments }
