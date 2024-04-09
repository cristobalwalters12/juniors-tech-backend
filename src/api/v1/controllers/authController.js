import { byEmailLogin } from '../models/userModel.js'
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
  const { password, totalDaysMuted, ...user } = userData
  user.accessToken = accessToken

  return res.status(200).json({
    status: 'success',
    data: user
  })
}

export { loginUser }
