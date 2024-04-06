import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { AppError } from '../../api/helpers/index.js'
import { ACCESS_TOKEN_SECRET } from '../index.js'

const JWT_ERRORS = {
  TokenExpiredError: 'Token expired',
  JsonWebTokenError: 'Invalid token or signature'
}

const jwtAdapter = {
  generateAccessToken: async (payload) => {
    const expiresInS = 86400 // 1 day
    const token = await promisify(jwt.sign)(payload, ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: expiresInS
    })
    return token
  },

  decodeAccessToken: async (token) =>
    await decodeToken(token, ACCESS_TOKEN_SECRET)
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
