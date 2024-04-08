import { ROLE_TYPES } from '../../../config/index.js'
import { AppError } from '../../helpers/index.js'
import { isAccountOwnerMuted } from '../models/userModel.js'

const hasRole = (req, roles) => {
  return req.user.roles.find(role => roles.includes(role)) !== undefined
}

const isOwner = (req) => req.user.id === req.resource.ownerId

const hasOpenRelatedReports = (req) => req.resource.reportReasons.includes(req.body.reportReasonId)

const isReported = (req) => req.resource.hasOpenReport

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

const protectReportedFromEdit = (req, res, next) => {
  if (isReported(req)) {
    return next(AppError.unauthorized('No se puede editar el recurso mientras tenga un reporte abierto'))
  }
  next()
}

const canBeMod = (req, res, next) => {
  if (req.user.id === req.resource.ownerId) {
    return next(AppError.unauthorized('No puedes autopromoverte a moderador'))
  }
  if (req.resource.roles.includes(ROLE_TYPES.MOD.name)) {
    return next(AppError.badRequest('El usuario ya es moderador'))
  }
  if (req.resource.isMuted) {
    return next(AppError.badRequest('Un usuario silenciado no puede ser moderador'))
  }
  next()
}

const canDemoteMod = (req, res, next) => {
  if (!req.resource.roles.includes(ROLE_TYPES.MOD.name)) {
    return next(AppError.badRequest('El usuario no es moderador'))
  }
  if (!req.user.roles.includes(ROLE_TYPES.ADMIN.name) && !isOwner(req)) {
    return next(AppError.unauthorized('No puedes quitarle el rol a otros moderadores'))
  }
  next()
}

const canBeMuted = (req, res, next) => {
  if (req.user.id === req.resource.ownerId) {
    return next(AppError.unauthorized('Solo puedes silenciar a otros usuarios'))
  }
  if (req.resource.isMuted) {
    return next(AppError.badRequest('El usuario ya está silenciado'))
  }
  if (req.resource.roles.includes(ROLE_TYPES.ADMIN.name)) {
    return next(AppError.unauthorized('No puedes silenciar a un administrador'))
  }
  next()
}

const isMuted = async (req, res, next) => {
  let user = req.resource
  if (typeof user?.isOwnerMuted !== 'boolean') {
    user = await isAccountOwnerMuted(req.user.id)
  }
  if (user.isOwnerMuted) {
    return next(AppError.unauthorized(`Estás silenciado. Debes esperar hasta el ${
      user.ownerMutedUntil} para poder realizar esta operación`))
  }
  next()
}

const canIgnoreReport = (req, res, next) => {
  if (!isReported(req)) {
    return next(AppError.badRequest('No hay reportes pendientes para desestimar'))
  }
  if (!hasOpenRelatedReports(req)) {
    return next(AppError.badRequest('No hay reportes por este motivo para desestimar'))
  }
  next()
}

export {
  restrictToRoles,
  restrictToOwnerOrRoles,
  restrictToOwner,
  protectReportedFromEdit,
  isMuted,
  canBeMod,
  canDemoteMod,
  canBeMuted,
  canIgnoreReport
}
