import Joi from 'joi'
import { pathVariablesValidatorBuilder } from '../../helpers/index.js'

const uidSchema = Joi.string().trim().length(10).messages({
  'string.length': 'El id ingresado es inválido',
  'string.empty': 'El id no puede estar vacío',
  'any.required': 'El id es obligatorio'
})

const validate = async ({ params: { id } }) => await uidSchema.validateAsync(id)

const uidValidator = pathVariablesValidatorBuilder(validate)

export { uidValidator }
