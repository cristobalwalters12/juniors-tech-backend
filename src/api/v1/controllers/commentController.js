import { create, getAll, updateById } from '../models/commentModel.js'

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

const editCommentById = async (req, res) => {
  const data = await updateById({
    commentId: req.params.commentId,
    currUserId: req.user.id,
    ...req.body
  })

  res.status(200).json({
    status: 'success',
    data
  })
}

export { createComment, getComments, editCommentById }
