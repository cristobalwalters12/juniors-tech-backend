import { ROLE_TYPES } from '../../../config/index.js'
import { AppError } from '../../helpers/index.js'

const hasRole = (req, roles) => {
  return req.user.roles.find(role => roles.includes(role)) !== undefined
}

const isOwner = (req) => req.user.id === req.resource.ownerId

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

const canBeMod = (req, res, next) => {
  if (req.user.id === req.resource.ownerId) {
    return next(AppError.badRequest('No puedes autopromoverte a moderador'))
  }
  if (req.resource.roles.includes(ROLE_TYPES.MOD.name)) {
    return next(AppError.badRequest('El usuario ya es moderador'))
  }
  if (req.resource.isMuted) {
    return next(AppError.badRequest('Un usuario silenciado no puede ser moderador'))
  }
  next()
}

export {
  restrictToRoles,
  restrictToOwnerOrRoles,
  restrictToOwner,
  isReported,
  canBeMod
}
