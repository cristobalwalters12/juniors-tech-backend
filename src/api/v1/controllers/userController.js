import { createUser, getByEmail, getUsers, getUserByUsername, updateUser, validateEmailById } from '../models/userModel.js'
import { jwtAdapter } from '../../../config/adapters/jwtAdapter.js'
const createUserjwtController = async (req, res) => {
  const { email, password, username, birthdate } = req.body
  const user = await getByEmail({ email })
  if (user) {
    res.status(400).json({ message: 'User already exists' })
  } else {
    const newUser = await createUser({ email, password, username, birthdate })
    const token = await jwtAdapter.generateAccessToken({ id: newUser.id, role: newUser.role })
    res.status(201).json({ message: 'User created', user: newUser, token })
  }
}

const getUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 100
    const users = await getUsers(page, size)
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
}
const getUserByUsernameController = async (req, res) => {
  try {
    const username = req.params.username
    const user = await getUserByUsername(username)
    if (!user) {
      res.status(404).json({
        error: 404,
        message: 'El usuario no existe'
      })
    } else if (user.isMuted) {
      res.status(404).json({
        error: 404,
        message: 'El usuario ha sido silenciado'
      })
    } else if (user.isDeleted) {
      res.status(404).json({
        error: 404,
        message: 'El usuario ha sido eliminado'
      })
    } else {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' })
  }
}

const updateUserController = async (req, res) => {
  try {
    console.log(req._id)
    const id = req.params.id
    const fields = req.body
    const user = await validateEmailById(id)
    if (!user) {
      res.status(404).json({
        error: 404,
        message: 'El usuario no existe'
      })
    } else if (user.isMuted) {
      res.status(404).json({
        error: 404,
        message: 'El usuario ha sido silenciado'
      })
    } else if (user.isDeleted) {
      res.status(404).json({
        error: 404,
        message: 'El usuario ha sido eliminado'
      })
    } else if (req._id !== id) {
      res.status(403).json({
        error: 403,
        message: 'El ID del token no coincide con el ID del usuario'
      })
    } else {
      const updatedUser = await updateUser(id, fields)
      res.json({
        message: 'Usuario actualizado',
        user: updatedUser
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
export { createUserjwtController, getUsersController, getUserByUsernameController, updateUserController }
