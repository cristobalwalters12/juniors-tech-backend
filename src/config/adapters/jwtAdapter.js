import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { AppError } from '../../api/helpers/index.js'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../index.js'

const JWT_ERRORS = {
  TokenExpiredError: 'Token expired',
  JsonWebTokenError: 'Invalid token or signature'
}

const jwtAdapter = {
  generateAccessToken: async (payload) => {
    const expiresInS = 900 // 15 minutes
    const token = await promisify(jwt.sign)(payload, ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: expiresInS
    })
    return token
  },

  generateRefreshToken: async (payload) => {
    const expiresInS = 604800 // 7 days
    const expirationDate = new Date(Date.now() + expiresInS * 1000)
    const token = await promisify(jwt.sign)(payload, REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: expiresInS
    })
    return { token, expirationDate }
  },

  decodeAccessToken: async (token) =>
    await decodeToken(token, ACCESS_TOKEN_SECRET),

  decodeRefreshToken: async (token) =>
    await decodeToken(token, REFRESH_TOKEN_SECRET)
}

const decodeToken = async (token, secret) => {
  try {
    return await promisify(jwt.verify)(token, secret)
  } catch (error) {
    const message = JWT_ERRORS[error.name]
    if (message) {
      throw AppError.unauthorized(message)
    } else {
      throw error
    }
  }
}

export { jwtAdapter }
