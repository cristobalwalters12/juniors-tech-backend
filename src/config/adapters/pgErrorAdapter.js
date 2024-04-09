import { AppError } from '../../api/helpers/index.js'
import { DB_ERROR_MESSAGES } from '../index.js'

const isDbAppError = (error) => {
  return error.code && /^22|23/.test(error.code)
}

const getDbError = (error) => {
  const errorMessage = DB_ERROR_MESSAGES[error.constraint]
  if (errorMessage) {
    return AppError.badRequest(errorMessage)
  } else {
    error.statusCode = 500
    return error
  }
}

export { isDbAppError, getDbError }
