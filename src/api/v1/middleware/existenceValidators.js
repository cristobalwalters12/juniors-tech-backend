import { AppError } from '../../helpers/AppError.js'
import { existsById as commentExistsById, parentCommentExist } from '../models/commentModel.js'
import { existsById as existsPostById } from '../models/postModel.js'

const postExists = async (req, res, next) => {
  const postId = req.params.id || req.params.postId
  const resource = await existsPostById(postId)
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

const commentExists = async (req, res, next) => {
  const comment = await commentExistsById({
    postId: req.params.postId,
    commentId: req.params.commentId
  })

  if (comment === undefined) {
    return next(AppError.notFound('El comentario no existe'))
  }

  req.resource = comment
  next()
}

export { postExists, canCreateComment, commentExists }
