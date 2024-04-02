import { AppError } from '../../helpers/index.js'

const notFoundHandler = (req, res, next) => {
  next(AppError.notFound(`The resource ${req.originalUrl} wasn't found`))
}

export { notFoundHandler }
