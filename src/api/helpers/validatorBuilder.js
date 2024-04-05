import { AppError } from './AppError.js'

const reqBodyValidatorBuilder =
  (validate, transform) => async (req, res, next) => {
    try {
      await validate(req)
      if (transform) req.body = await transform(req)
      next()
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(AppError.badRequest(error.message))
      } else {
        return next(error)
      }
    }
  }

const pathVariablesValidatorBuilder =
  (validate, params) => async (req, res, next) => {
    try {
      await validate(req, params)
      next()
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(AppError.badRequest(error.message))
      } else {
        return next(error)
      }
    }
  }

const queryParamsValidatorBuilder =
  (validate, transform) => async (req, res, next) => {
    if (isObjectEmpty(req.query)) {
      next()
      return
    }
    try {
      await validate(req)
      if (transform) req.query = await transform(req)
      next()
    } catch (error) {
      if (error.name === 'ValidationError') {
        return next(AppError.badRequest(error.message))
      } else {
        return next(error)
      }
    }
  }

/* eslint no-unreachable-loop: "off" */
const isObjectEmpty = (obj) => {
  for (const key in obj) {
    return false
  }
  return true
}

export {
  reqBodyValidatorBuilder,
  queryParamsValidatorBuilder,
  pathVariablesValidatorBuilder
}
