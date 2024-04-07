import Joi from 'joi'
import { REPORT_REASONS, getUUID } from '../../../config/index.js'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'

const reportReasons = Object.values(REPORT_REASONS)

const createReportSchema = Joi.object({
  reportReasonId: Joi.string().valid(...reportReasons)
    .messages({
      'any.only': 'El valor de reportReasonId es inválido',
      'any.required': 'Debes proporcionar un valor de reportReasonId'
    })
    .required()
})

const validateCreateReport = async ({ body }) => await createReportSchema.validateAsync(body)

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.reportId = getUUID()
    body.relationshipId = getUUID()
  }
  return body
}

const createReportDto = reqBodyValidatorBuilder(validateCreateReport, transform)

export { createReportDto }
