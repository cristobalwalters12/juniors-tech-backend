import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'
import { getUUID } from '../../../config/index.js'
import { uidSchema } from '../middleware/index.js'

const commentSchema = Joi.object({
  postId: uidSchema.label('El postId'),
  parentId: uidSchema.label('El parentId'),
  body: Joi.string().trim().min(4).messages({
    'string.min': 'El comentario debe tener al menos 4 caracteres',
    'string.empty': 'El comentario no puede estar vacío',
    'any.required': 'El texto del comentario es obligatorio'
  }).required()
}).options({ abortEarly: false })

const validate = async ({ body, params }) => await commentSchema.validateAsync({ ...body, postId: params.postId })

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.id = getUUID()
  }
  body.body = body.body.trim()
  return body
}

const commentDto = reqBodyValidatorBuilder(validate, transform)

export { commentDto }
