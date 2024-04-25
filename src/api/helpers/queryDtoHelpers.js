import Joi from 'joi'

const querySchema = Joi.string().trim().required().messages({
  'string.empty': "El valor de 'q' no puede estar vacío",
  'any.required': "Debes ingresar un título en el parámetro de consulta 'q'"
})

const orderSchema = Joi.string().valid('asc', 'desc').insensitive().messages({
  'any.only': "Los valores válidos de 'order' son: asc, desc"
})

const pageSchema = Joi.number().integer().optional().messages({
  'number.base': "El valor de 'page' debe ser un número",
  'number:integer': "El valor de 'page' debe ser un número entero"
})

const limitSchema = Joi.number().integer().optional().messages({
  'number.base': "El valor de 'limit' debe ser un número",
  'number:integer': "El valor de 'limit' debe ser un número entero"
})

const paginationSchema = Joi.object().keys({
  order: Joi.when('sort', {
    is: Joi.exist(),
    then: orderSchema.optional(),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Solo se puede proporcionar un valor de 'order' junto con uno de 'sort'"
    })
  }).messages({
    'string.empty': "El valor de 'order' no puede estar vacío"
  }),
  page: pageSchema,
  limit: limitSchema
})

const searchSchema = paginationSchema.keys({
  q: querySchema
})

const transformPagination = ({ sortOptions, defaults }) => ({ query }) => {
  const { sort, page, limit } = query
  query.sort = sort ? sortOptions[sort] : defaults.sort
  query.order = sort && query.order ? query.order : defaults.order
  query.page = page ? +page : 1
  query.limit = limit ? +limit : 20
  return query
}

export { paginationSchema, searchSchema, transformPagination }
