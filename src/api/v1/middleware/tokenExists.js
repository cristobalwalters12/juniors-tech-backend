import { AppError } from '../../helpers/index.js'

const TokenValidator = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req)
    if (!token) {
      throw AppError.unauthorized('Bearer token not found')
    }

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

export { TokenValidator }
