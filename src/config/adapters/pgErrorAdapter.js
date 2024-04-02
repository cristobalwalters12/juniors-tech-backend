import { AppError } from '../../api/helpers/index.js'

const handleDuplicateDB = ({ detail }) => {
  const column = detail.match(/(?<=\().+?(?=\))/)
  return `This ${column} already exists`
}

const ERR_MSG_GENERATORS = {
  23505: handleDuplicateDB
}

const isDbAppError = (error) => {
  return error.code && /^22|23/.test(error.code)
}

const getDbError = (error) => {
  const msgGenerator = ERR_MSG_GENERATORS[error.code]
  if (msgGenerator) {
    return AppError.badRequest(msgGenerator(error))
  } else {
    error.statusCode = 500
    return error
  }
}

export { isDbAppError, getDbError }
