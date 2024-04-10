import Joi from 'joi'
import { CATEGORIES, POST_SORT_OPTIONS } from '../../../config/dbConstants/entityTypeIds.js'
import { queryParamsValidatorBuilder } from '../../helpers/index.js'

// Constants
const queryCategories = Object.keys(CATEGORIES)
const stringCategories = queryCategories.join(', ')

// Schemas
const querySchema = Joi.string().trim().required().messages({
  'string.empty': "El valor de 'title' no puede estar vacío",
  'any.required': "Debes ingresar un título en el parámetro de consulta 'title'"
})

const orderSchema = Joi.string().valid('asc', 'desc').insensitive().messages({
  'any.only': "El valor de 'order' solo puede ser 'asc' o 'desc'"
})

const postSortSchema = Joi.string().valid('votes', 'date').insensitive().messages({
  'any.only': "El valor de sort solo puede ser 'votes' o 'date'",
  'string.empty': 'El valor de sort no puede estar vacío'
})

const postFilterSchema = Joi.string().valid(...queryCategories).insensitive().messages({
  'any.only': `Las categorías disponibles son: ${stringCategories}`
})

const pageSchema = Joi.number().integer().optional().messages({
  'number.base': "El valor de 'page' debe ser un número",
  'number:integer': "El valor de 'page' debe ser un número entero"
})

const limitSchema = Joi.number().integer().optional().messages({
  'number.base': "El valor de 'limit' debe ser un número",
  'number:integer': "El valor de 'limit' debe ser un número entero"
})

const postSearchSchema = Joi.object({
  title: querySchema,
  sort: postSortSchema.optional(),
  order: Joi.when('sort', {
    is: Joi.exist(),
    then: orderSchema.optional(),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Solo se puede proporcionar un valor de 'order' junto con uno de 'sort'"
    })
  }).messages({
    'string.empty': "El valor de 'order' no puede estar vacío"
  }),
  category: postFilterSchema,
  page: pageSchema,
  limit: limitSchema
}).options({ abortEarly: false }).messages({
  'object.unknown': "Las únicas queries permitidas son: 'title', 'sort', 'order', 'category', 'page' y 'limit'"
})

const postPaginationSchema = Joi.object({
  sort: postSortSchema.optional(),
  order: Joi.when('sort', {
    is: Joi.exist(),
    then: orderSchema.optional(),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Solo se puede proporcionar un valor de 'order' junto con uno de 'sort'"
    })
  }).messages({
    'string.empty': "El valor de 'order' no puede estar vacío"
  }),
  category: postFilterSchema,
  page: pageSchema,
  limit: limitSchema
}).options({ abortEarly: false }).messages({
  'object.unknown': "Las únicas queries permitidas son: 'title', 'sort', 'order', 'category', 'page' y 'limit'"
})

// DTO functions
const validatePostSearch = async ({ query }) => await postSearchSchema.validateAsync(query)
const validatePostPagination = async ({ query }) => await postPaginationSchema.validateAsync(query)

const transformPostPagination = ({ query }) => {
  const { sort, page, limit, category } = query
  query.sort = sort ? POST_SORT_OPTIONS[sort] : POST_SORT_OPTIONS.votes
  query.order = sort ? query.order : 'desc'
  query.page = page ? +page : 1
  query.limit = limit ? +limit : 20
  query.category = CATEGORIES[category]
  return query
}

const transformPostSearch = ({ query }) => {
  query.title = `%${query.title}%`
  return transformPostPagination(query)
}

// DTOs
const postSearchDto = queryParamsValidatorBuilder(validatePostSearch, transformPostSearch)
const postPaginationDto = queryParamsValidatorBuilder(validatePostPagination, transformPostPagination)

export { postSearchDto, postPaginationDto }
