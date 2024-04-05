import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'
import { getUUID } from '../../../config/index.js'
import { uidSchema } from '../middleware/index.js'

const commentSchema = Joi.object({
  parentId: uidSchema.label('El parentId'),
  body: Joi.string().trim().min(4).messages({
    'string.min': 'El comentario debe tener al menos 4 caracteres',
    'string.empty': 'El comentario no puede estar vacío',
    'any.required': 'El texto del comentario es obligatorio'
  }).required()
}).options({ abortEarly: false })

const validate = async ({ body }) => await commentSchema.validateAsync(body)

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.id = getUUID()
  }
  body.body = body.body.trim()
  return body
}

const commentDto = reqBodyValidatorBuilder(validate, transform)

export { commentDto }
