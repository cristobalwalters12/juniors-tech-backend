import Joi from 'joi'
import {
  pathVariablesValidatorBuilder,
  queryParamsValidatorBuilder
} from '../../helpers/index.js'

const VALID_COLUMNS = ['id', 'nombre', 'categoria', 'metal', 'precio', 'stock']

const pathSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required()
})

const pageSchema = Joi.object({
  order_by: Joi.string()
    .replace(/_(ASC|DESC)/gi, '')
    .valid(...VALID_COLUMNS),
  page: Joi.number().integer().min(1),
  limits: Joi.number().integer().min(1)
}).options({ abortEarly: false })

const filtersSchema = Joi.object({
  categoria: Joi.string().min(1),
  metal: Joi.string().min(1),
  precio_min: Joi.number().integer().min(0),
  precio_max: Joi.when('precio_min', {
    is: Joi.exist(),
    then: Joi.number()
      .integer()
      .min(Joi.ref('precio_min'))
      .message('precio_max must be greater than or equal to precio_min'),
    otherwise: Joi.number()
      .integer()
      .min(0)
      .message('precio_max must be greater than or equal to 0')
  }).label('precio_max')
}).options({ abortEarly: false })

const validateJoyaId = pathVariablesValidatorBuilder(pathSchema)
const validateJoyaQueryParams = queryParamsValidatorBuilder(pageSchema)
const validateJoyaFilters = queryParamsValidatorBuilder(filtersSchema)

export { validateJoyaId, validateJoyaQueryParams, validateJoyaFilters }
