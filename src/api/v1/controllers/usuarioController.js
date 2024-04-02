import { create, getByEmail } from '../models/usuarioModel.js'

const createUser = async (req, res) => {
  const data = await create(req.body)
  res.status(201).json({
    status: 'success',
    data
  })
}

const getUserByEmail = async (req, res) => {
  const { password, ...data } = await getByEmail(req._email)
  res.status(200).json({
    status: 'success',
    data
  })
}

export { createUser, getUserByEmail }
