import { ROLE_TYPES } from '../../../config/index.js'
import { AppError } from '../../helpers/index.js'

const isOwnerModOrAdmin = (req, res, next) => {
  const isOwner = req.user.id === req.resource.authorId
  const isModOrAdmin = req.user.roles.find(role => role === ROLE_TYPES.MOD.name || ROLE_TYPES.ADMIN.name)

  if (!isOwner && !isModOrAdmin) {
    return next(AppError.unauthorized('No tienes permisos para hacer esta operación'))
  }
}

const isReported = (req, res, next) => {
  if (req.resource.reportedAt !== null) {
    return next(AppError.unauthorized('No se puede editar hasta que no se resuelva el reporte'))
  }

  next()
}

export { isOwnerModOrAdmin, isReported }
