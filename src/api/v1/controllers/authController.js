import { byEmailLogin, validateEmailById, changePassword } from '../models/userModel.js'
import { jwtAdapter, bcryptAdapter } from '../../../config/index.js'
import { AppError } from '../../helpers/AppError.js'

const loginUser = async (req, res) => {
  const { email, password: plainPassword } = req.body
  const userData = await byEmailLogin(email)

  if (userData === undefined) {
    throw AppError.unauthorized('Correo o contraseña inválidos')
  }

  if (userData.deleted) {
    throw AppError.unauthorized('Esta cuenta está desactivada')
  }

  const match = await bcryptAdapter.compare(plainPassword, userData.password)
  if (!match) {
    throw AppError.unauthorized('Correo o contraseña inválidos')
  }

  const accessToken = await jwtAdapter.generateAccessToken({ id: userData.id, roles: userData.roles })
  const { password, totalDaysMuted, deleted, ...user } = userData
  user.accessToken = accessToken
  return res.status(200).json({
    status: 'success',
    data: user
  })
}

const changePasswordController = async (req, res) => {
  try {
    const id = req._id
    console.log(id)
    const { password, newPassword } = req.body
    const userData = await validateEmailById(id)
    if (userData === undefined) {
      throw AppError.unauthorized('Correo o contraseña inválidos')
    }
    if (userData.deleted) {
      throw AppError.unauthorized('Esta cuenta está desactivada')
    }
    const match = await bcryptAdapter.compare(password, userData.password)
    if (!match) {
      throw AppError.unauthorized('Correo o contraseña inválidos')
    } else {
      await changePassword(id, newPassword)
      const updatedUser = await validateEmailById(id)
      return res.status(200).json({
        status: 'success',
        data: updatedUser
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
export { loginUser, changePasswordController }
