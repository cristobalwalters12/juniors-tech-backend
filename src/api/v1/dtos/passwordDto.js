import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'

const changePasswordSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().required().min(8).max(60)
}).options({ abortEarly: false })

const validate = async ({ body }) => await changePasswordSchema.validateAsync(body)

const transform = async ({ body }) => {
  const password = body.password
  const newPassword = body.newPassword
  return { ...body, password, newPassword }
}

const changePasswordDto = reqBodyValidatorBuilder(validate, transform)

export { changePasswordDto }
