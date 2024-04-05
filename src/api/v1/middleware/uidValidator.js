import Joi from 'joi'
import { pathVariablesValidatorBuilder } from '../../helpers/index.js'

const uidSchema = Joi.string().trim().length(10).messages({
  'string.length': '{{#label}} ingresado es inválido',
  'string.empty': '{{#label}} no puede estar vacío',
  'any.required': '{{#label}} es obligatorio'
}).required()

const validate = async ({ params: { id } }) => await uidSchema.label('El id').validateAsync(id)

const uidValidator = pathVariablesValidatorBuilder(validate)

export { uidValidator, uidSchema }
