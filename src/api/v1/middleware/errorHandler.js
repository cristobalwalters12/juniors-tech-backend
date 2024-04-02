import { NODE_ENV, getDbError, isDbAppError } from '../../../config/index.js'

const errorHandler = (err, req, res, next) => {
  const error = isDbAppError(err) ? getDbError(err) : err
  const statusCode = error.statusCode || 500
  const resBody = getResponseBody(error)
  res.status(statusCode).json(resBody)
}

const getResponseBody = (error) => {
  const resBody = {
    status: error.status || 'error',
    timestamp: new Date().toISOString()
  }

  const inDevMode = NODE_ENV === 'development'

  if (error.isOperational || inDevMode) {
    resBody.message = error.message
  } else {
    resBody.message = 'Something went wrong'
  }

  if (inDevMode) {
    resBody.data = error.stack
  }

  return resBody
}

export { errorHandler }
