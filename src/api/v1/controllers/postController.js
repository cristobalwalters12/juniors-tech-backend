import { create } from '../models/postModels.js'

const createPost = async (req, res) => {
  const data = await create(req.body)
  res.status(201).json({
    status: 'success',
    data
  })
}

export { createPost }
