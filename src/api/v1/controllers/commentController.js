import { create } from '../models/commentModel.js'

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
export { createComment }
