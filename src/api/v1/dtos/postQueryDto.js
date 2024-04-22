import Joi from 'joi'
import { POST_SORT_OPTIONS } from '../../../config/dbConstants/entityTypeIds.js'
import { queryParamsValidatorBuilder } from '../../helpers/index.js'
import { uidSchema } from '../middleware/validateUids.js'
import { paginationSchema, searchSchema, transformPagination } from '../../helpers/queryDtoHelpers.js'

// VALID VALUES
const postSortOptions = Object.keys(POST_SORT_OPTIONS)

// SCHEMAS
const postSortSchema = Joi.string().valid(...postSortOptions).insensitive().messages({
  'any.only': `Los valores válidos de sort son: ${postSortOptions.join(',')}`,
  'string.empty': 'El valor de sort no puede estar vacío'
})

const postSearchSchema = searchSchema.keys({
  sort: postSortSchema.optional(),
  category: uidSchema.label('El valor de category')
}).options({ abortEarly: false }).messages({
  'object.unknown': "Las únicas queries permitidas son: 'q', 'sort', 'order', 'category', 'page' y 'limit'"
})

const postPaginationSchema = paginationSchema.keys({
  sort: postSortSchema.optional(),
  category: uidSchema.label('El valor de category')
}).options({ abortEarly: false }).messages({
  'object.unknown': "Las únicas queries permitidas son: 'sort', 'order', 'category', 'page' y 'limit'"
})

// VALIDATION FUNCTIONS
const validatePostSearch = async ({ query }) => await postSearchSchema.validateAsync(query)
const validatePostPagination = async ({ query }) => await postPaginationSchema.validateAsync(query)

// TRANSFORMATION FUNCTIONS
const transformPostPagination = transformPagination({
  sortOptions: POST_SORT_OPTIONS,
  defaults: {
    sort: POST_SORT_OPTIONS.votes,
    order: 'desc'
  }
})

const transformPostSearch = ({ query }) => {
  query.q = `%${query.q}%`
  return transformPostPagination({ query })
}

// DTOs
const postSearchDto = queryParamsValidatorBuilder(validatePostSearch, transformPostSearch)
const postPaginationDto = queryParamsValidatorBuilder(validatePostPagination, transformPostPagination)

export { postSearchDto, postPaginationDto }
