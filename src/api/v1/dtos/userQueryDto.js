import Joi from 'joi'
import { USER_SORT_OPTIONS } from '../../../config/dbConstants/entityTypeIds.js'
import { queryParamsValidatorBuilder } from '../../helpers/index.js'
import { uidSchema } from '../middleware/validateUids.js'
import { searchSchema, transformPagination } from '../../helpers/queryDtoHelpers.js'

// VALID VALUES
const userSortOptions = Object.keys(USER_SORT_OPTIONS)

// SCHEMAS
const userSortSchema = Joi.string().valid(...userSortOptions).insensitive().messages({
  'any.only': `Los valores válidos de sort son: ${userSortOptions.join(',')}`,
  'string.empty': 'El valor de sort no puede estar vacío'
})

const userSearchSchema = searchSchema.keys({
  sort: userSortSchema.optional(),
  country: uidSchema.label('El valor de country'),
  otw: Joi.number().valid(0, 1).messages({
    'number.base': 'otw debe ser un número',
    'any.only': 'otw debe ser igual a 0 o a 1'
  }),
  it: uidSchema.label('El valor de it'),
  lang: Joi.array().items(uidSchema.messages({
    'string.empty': "El listado de idiomas 'lang' no puede estar vacío",
    'string.length': 'El id {:[.]} no corresponde a un idioma válido'
  })),
  tech: Joi.array().items(uidSchema.messages({
    'string.empty': "El listado de tecnologías 'tech' no puede estar vacío",
    'string.length': 'El id {:[.]} no corresponde a una tecnología válida'
  }))
}).options({ abortEarly: false }).messages({
  'object.unknown': "Las únicas queries permitidas son: 'q', 'sort', 'order', 'page', 'limit', 'country', 'otw', 'it', 'lang' y 'tech'"
})

// VALIDATION FUNCTIONS
const validateUserSearch = async ({ query }) => {
  query.lang = query.lang && decodeURIComponent(query.lang).split(',')
  query.tech = query.tech && decodeURIComponent(query.tech).split(',')
  await userSearchSchema.validateAsync(query)
}

// TRANSFORMATION FUNCTIONS
const transformUserPagination = transformPagination({
  sortOptions: USER_SORT_OPTIONS,
  defaults: {
    sort: USER_SORT_OPTIONS.score,
    order: 'desc'
  }
})

const transformUserSearch = ({ query }) => {
  query.q = `%${query.q}%`
  const otw = query.otw
  query.otw = otw !== undefined ? Boolean(+otw) : undefined
  return transformUserPagination({ query })
}

// DTOs
const userSearchDto = queryParamsValidatorBuilder(validateUserSearch, transformUserSearch)

export { userSearchDto }
