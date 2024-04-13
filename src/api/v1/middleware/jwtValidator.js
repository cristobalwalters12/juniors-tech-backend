import { jwtAdapter } from '../../../config/index.js'
import { AppError } from '../../helpers/index.js'

const jwtValidator = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req)
    if (!token) {
      throw AppError.unauthorized('Bearer token not found')
    }

    const { id, roles } = await jwtAdapter.decodeAccessToken(token)
    req._id = id
    req._role = roles[0]
    return next()
  } catch (error) {
    next(error)
  }
}

const getTokenFromHeaders = (req) => {
  const header = req.get('Authorization')
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '')
  }
  return null
}

export { jwtValidator }
