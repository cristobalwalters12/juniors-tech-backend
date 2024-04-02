import { AppError } from '../../helpers/index.js'

const methodNotAllowedHandler = (req, res, next) => {
  res.setHeader('Allow', getAllowedMethods(req))
  const message = `${req.method} requests aren't allowed on ${req.originalUrl}`
  next(AppError.methodNotAllowed(message))
}

const getAllowedMethods = ({ methods }) => {
  const allowedMethods = []
  for (const method in methods) {
    if (method === 'get') {
      allowedMethods.push('GET', 'HEAD')
    } else if (method === '_all') {
      continue
    } else {
      allowedMethods.push(method.toUpperCase())
    }
  }
  return allowedMethods.join(', ')
}

export { methodNotAllowedHandler }
