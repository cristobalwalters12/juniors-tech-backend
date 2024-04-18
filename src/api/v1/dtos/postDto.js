import Joi from 'joi'
import slugify from 'slugify'
import { reqBodyValidatorBuilder } from '../../helpers/validatorBuilder.js'
import { getUUID } from '../../../config/index.js'

const postSchema = Joi.object({
  categoryId: Joi.string().length(10)
    .messages({
      'string.length': 'El id ingresado es inválido',
      'string.empty': 'La categoría es obligatoria',
      'any.required': 'La categoría es obligatoria'
    })
    .required(),
  title: Joi.string().trim().min(4).max(300)
    .messages({
      'string.min': 'El título debe tener al menos 4 caracteres',
      'string.max': 'El título no puede tener más de 300 caracteres',
      'string.empty': 'El título no puede estar vacío',
      'any.required': 'El título es obligatorio'
    })
    .required(),
  body: Joi.string().trim().min(4).messages({
    'string.min': 'La descripción debe tener al menos 4 caracteres',
    'string.empty': 'La descripción no puede estar vacía',
    'any.required': 'La descripción es obligatoria'
  }).required()
}).options({ abortEarly: false })

const validate = async ({ body }) => await postSchema.validateAsync(body)

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.postId = getUUID()
  }
  body.title = body.title.trim()
  body.body = body.body.trim()
  body.slug = slugify(body.title, {
    lower: true,
    remove: /[^a-zA-Z0-9\- ]*/g,
    locale: 'en'
  })
  return body
}

const postDto = reqBodyValidatorBuilder(validate, transform)

export { postDto }
