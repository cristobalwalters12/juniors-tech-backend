import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'

const registerSchema = Joi.object({
  email: Joi.string().email().required().max(50),
  password: Joi.string().required().min(8).max(60)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  username: Joi.string().required().min(6).max(25),
  birthdate: Joi.date().max('now').min('1903-01-01').required()
}).options({ abortEarly: false })

const validate = async ({ body }) => await registerSchema.validateAsync(body)

const transform = async ({ body }) => {
  const email = body.email.toLowerCase()

  return {
    ...body,
    email
  }
}

const registerDto = reqBodyValidatorBuilder(validate, transform)

export { registerDto }
