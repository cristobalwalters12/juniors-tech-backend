import Joi from 'joi'
import { getUUID } from '../../../config/index.js'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'

const voteSchema = Joi.object({
  voteDirection: Joi.number().valid(1, -1)
    .messages({
      'number.base': 'voteDirection debe ser un número',
      'any.only': 'voteDirection debe ser igual a 1 o a -1',
      'any.required': 'Debes proporcionar un valor de voteDirection'
    })
    .required()
})
const validate = async ({ body }) => await voteSchema.validateAsync(body)

const transform = async ({ body }) => {
  body.voteId = getUUID()
  return body
}

const voteDto = reqBodyValidatorBuilder(validate, transform)

export { voteDto }
