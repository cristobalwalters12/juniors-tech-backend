import { AppError } from '../../helpers/index.js'

const hasRole = (req, roles) => {
  return req.user.roles.find(role => roles.includes(role)) !== undefined
}

const isOwner = (req) => req.user.id === req.resource.authorId

const restrictToRoles = (roles) => (req, res, next) => {
  if (!hasRole(req, roles)) {
    return next(AppError.unauthorized('No tienes permisos para hacer esta operación'))
  }
  next()
}

const restrictToOwnerOrRoles = (roles) => (req, res, next) => {
  if (!isOwner(req) && !hasRole(req, roles)) {
    return next(AppError.unauthorized('No tienes permisos para hacer esta operación'))
  }
  next()
}

const restrictToOwner = (req, res, next) => {
  if (!isOwner(req)) {
    return next(AppError.unauthorized('No tienes permisos para hacer esta operación'))
  }
  next()
}

const isReported = (req, res, next) => {
  if (req.resource.hasOpenReport) {
    return next(AppError.unauthorized('No se puede editar el recurso mientras tenga un reporte abierto'))
  }

  next()
}

export {
  restrictToRoles,
  restrictToOwnerOrRoles,
  restrictToOwner,
  isReported
}
