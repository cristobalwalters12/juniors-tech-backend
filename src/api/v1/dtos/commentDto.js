import Joi from 'joi'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'
import { getUUID } from '../../../config/index.js'
import { uidSchema } from '../middleware/index.js'

const bodySchema = Joi.string().trim().min(4).messages({
  'string.min': 'El comentario debe tener al menos 4 caracteres',
  'string.empty': 'El comentario no puede estar vacío',
  'any.required': 'El texto del comentario es obligatorio'
}).required()

const createCommentSchema = Joi.object({
  parentId: uidSchema.label('El parentId').required(),
  body: bodySchema
}).options({ abortEarly: false })

const editCommentSchema = Joi.object({
  body: bodySchema
}).options({ abortEarly: false })

const validateCreateComment = async ({ body }) => await createCommentSchema.validateAsync(body)
const validateEditComment = async ({ body }) => await editCommentSchema.validateAsync(body)

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.id = getUUID()
  }
  body.body = body.body.trim()
  return body
}

const createCommentDto = reqBodyValidatorBuilder(validateCreateComment, transform)
const editCommentDto = reqBodyValidatorBuilder(validateEditComment, transform)

export { createCommentDto, editCommentDto }
