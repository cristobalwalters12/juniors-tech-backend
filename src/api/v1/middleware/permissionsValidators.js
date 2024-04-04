import { AppError } from '../../helpers/index.js'

const isOwnerOrHasRole = (roles) => (req, res, next) => {
  const isOwner = req.user.id === req.resource.authorId

  if (!isOwner) {
    let hasRole = false

    if (roles.length !== 0) {
      hasRole = req.user.roles.find(role => roles.includes(role)) !== undefined
    }

    if (!hasRole) {
      return next(AppError.unauthorized('No tienes permisos para hacer esta operación'))
    }
  }

  next()
}

const isReported = (req, res, next) => {
  if (req.resource.reportedAt !== null) {
    return next(AppError.unauthorized('No se puede editar hasta que no se resuelva el reporte'))
  }

  next()
}

export { isOwnerOrHasRole, isReported }
