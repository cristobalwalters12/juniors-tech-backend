import { AppError } from '../../helpers/AppError.js'
import { byEmailLogin } from '../models/usuarioModel.js'
import { bcryptAdapter, jwtAdapter } from '../../../config/index.js'

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const userInDb = await byEmailLogin({ email })
  if (!userInDb) {
    throw AppError.unauthorized('Invalid email or password')
  }

  const passwordValid = await bcryptAdapter.compare(
    password,
    userInDb.password
  )

  if (!passwordValid) {
    throw AppError.unauthorized('Invalid email or password')
  }

  const { token, expirationDate } = await jwtAdapter.generateRefreshToken({
    id: userInDb.id, role: userInDb.role
  })
  res.cookie('token', token, {
    expires: expirationDate,
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  })
  const accessToken = await jwtAdapter.generateAccessToken({ id: userInDb.id, role: userInDb.role })
  return res.status(200).json({
    status: 'success',
    data: { accessToken, userInDb }
  })
}

const logoutUser = async (req, res) => {
  res.clearCookie('token')
  res.status(204).send()
}

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.token
  if (!refreshToken) throw AppError.unauthorized('Token not found')

  const { email } = await jwtAdapter.decodeRefreshToken(refreshToken)
  const accessToken = await jwtAdapter.generateAccessToken({ email })

  return res.status(200).json({
    status: 'success',
    data: { accessToken }
  })
}

export { loginUser, logoutUser, refreshToken }
