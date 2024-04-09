import Joi from 'joi'
import { pathVariablesValidatorBuilder } from '../../helpers/index.js'

const uidSchema = Joi.string().trim().length(10).messages({
  'string.length': '{{#label}} ingresado es inválido',
  'string.empty': '{{#label}} no puede estar vacío',
  'any.required': '{{#label}} es obligatorio'
})

const validate = async (req, ids) => await Promise.all(ids.map(id =>
  uidSchema.label(`El ${id}`).required().validateAsync(req.params[id])
))

const validateUids = (ids) => pathVariablesValidatorBuilder(validate, ids)

export { validateUids, uidSchema }
