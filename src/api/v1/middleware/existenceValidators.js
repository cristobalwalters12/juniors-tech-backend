import { AppError } from '../../helpers/AppError.js'
import { existsById as existsPostById } from '../models/postModel.js'

const postExists = async (req, res, next) => {
  const resource = await existsPostById(req.params.id)
  if (resource === undefined) {
    return next(AppError.notFound('La publicación no existe'))
  }
  req.resource = resource
  next()
}

export { postExists }
