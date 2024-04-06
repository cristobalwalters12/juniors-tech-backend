import { AppError } from '../../helpers/AppError.js'
import { byEmailLogin } from '../models/usuarioModel.js'
import { jwtAdapter } from '../../../config/index.js'
import bcrypt from 'bcryptjs'

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await byEmailLogin({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    } else {
      console.log('este es del login', password)
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const accessToken = await jwtAdapter.generateAccessToken({ id: user.id, role: user.role })
        const tokenDecoded = jwtAdapter.decodeAccessToken(accessToken)
        res.status(200).json({
          status: 'success',
          message: 'Token is valid',
          data: {
            user,
            accessToken
          },
          tokenDecoded
        })
      } else {
        res.status(400).json({ message: 'Invalid password' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
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
