import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'

const registerSchema = Joi.object({
  email: Joi.string().email().required().max(50),
  password: Joi.string().required().min(6).max(60)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .messages({
      'string.min': 'la "contraseña" tiene que tener mas de 6 caracteres',
      'string.pattern.base': 'la"contraseña" tiene que contener al menos un caracter en mayuscula y uno en minuscula y mas de 6 caracteres'
    }),
  username: Joi.string().required().min(6).max(25).pattern(/^\S*$/).messages({
    'string.min': 'el "nombre de usuario" tiene que tener mas de 6 caracteres',
    'string.pattern.base': 'el "nombre de usuario" no puede contener espacios en blanco'
  }),
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
