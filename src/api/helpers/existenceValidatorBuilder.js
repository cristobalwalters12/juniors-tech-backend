import { AppError } from './index.js'

const existenceValidatorBuilder = (existsById, errorMessage) => async (req, res, next) => {
  const resource = await existsById(req.params.id)
  if (resource === undefined) {
    return next(AppError.notFound(errorMessage))
  }
  req.resource = resource
  next()
}

export { existenceValidatorBuilder }
