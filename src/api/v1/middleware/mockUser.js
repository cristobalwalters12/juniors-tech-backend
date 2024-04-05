import { ROLE_TYPES } from '../../../config/index.js'

const mockUser = (req, res, next) => {
  req.user = {
    id: 'sYfjpcR8ge',
    roles: [
      ROLE_TYPES.USER.name,
      ROLE_TYPES.ADMIN.name
    ]
  }
  next()
}

export { mockUser }
