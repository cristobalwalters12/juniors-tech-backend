import { jwtAdapter } from '../../../config/index.js'
import { AppError } from '../../helpers/index.js'

const setUserIfLoggedIn = async (req, res, next) => {
  const token = getTokenFromHeaders(req)
  if (token === null) return next()
  try {
    const { id, role } = await jwtAdapter.decodeAccessToken(token)
    req.user = { id, roles: [role] }
    return next()
  } catch (error) {
    return next(error)
  }
}

const requireLoggedIn = async (req, res, next) => {
  const token = getTokenFromHeaders(req)
  try {
    if (token === null) {
      throw AppError.unauthorized('Bearer token not found')
    }
    const { id, role } = await jwtAdapter.decodeAccessToken(token)
    req.user = { id, roles: [role] }
    return next()
  } catch (error) {
    return next(error)
  }
}

const getTokenFromHeaders = (req) => {
  const header = req.get('Authorization')
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '')
  }
  return null
}

export { setUserIfLoggedIn, requireLoggedIn }
