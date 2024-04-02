import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'
import { bcryptAdapter } from '../../../config/index.js'

const registerSchema = Joi.object({
  email: Joi.string().email().required().max(50),
  password: Joi.string().required().min(6).max(60),
  rol: Joi.string().max(25),
  lenguaje: Joi.string().max(20)
}).options({ abortEarly: false })

const validate = async ({ body }) => await registerSchema.validateAsync(body)

const transform = async ({ body }) => {
  const email = body.email.toLowerCase()
  const password = await bcryptAdapter.hash(body.password)

  return {
    ...body,
    email,
    password
  }
}

const registerDto = reqBodyValidatorBuilder(validate, transform)

export { registerDto }
