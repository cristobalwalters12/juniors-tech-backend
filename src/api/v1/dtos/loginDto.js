import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'

const loginSchema = Joi.object({
  email: Joi.string().email().required().max(50),
  password: Joi.string().required().min(8).max(60)
}).options({ abortEarly: false })

const validate = async ({ body }) => await loginSchema.validateAsync(body)

const transform = async ({ body }) => {
  const email = body.email.toLowerCase()
  return { ...body, email }
}

const loginDto = reqBodyValidatorBuilder(validate, transform)

export { loginDto }
