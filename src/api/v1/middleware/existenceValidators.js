import { AppError } from '../../helpers/AppError.js'
import { parentCommentExist } from '../models/commentModel.js'
import { existsById as existsPostById } from '../models/postModel.js'

const postExists = async (req, res, next) => {
  const resource = await existsPostById(req.params.id)
  if (resource === undefined) {
    return next(AppError.notFound('La publicación no existe'))
  }
  req.resource = resource
  next()
}

const canCreateComment = async (req, res, next) => {
  const parentComment = await parentCommentExist(req.body.parentId)
  if (!parentComment.exists) {
    return next(AppError.notFound('La publicación o comentario al que intentas responder no existe'))
  }
  next()
}

export { postExists, canCreateComment }
