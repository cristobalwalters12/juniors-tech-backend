class AppError extends Error {
  constructor (message, statusCode) {
    super(message)

    this.statusCode = statusCode
    this.status = statusCode < 500 ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest (message) {
    return new AppError(message, 400)
  }

  static unauthorized (message) {
    return new AppError(message, 401)
  }

  static forbidden (message) {
    return new AppError(message, 403)
  }

  static notFound (message) {
    return new AppError(message, 404)
  }

  static methodNotAllowed (message) {
    return new AppError(message, 405)
  }

  static internalError (message) {
    return new AppError(message, 500)
  }
}

export { AppError }
