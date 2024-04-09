import Joi from 'joi'
import { REPORT_REASONS, getUUID } from '../../../config/index.js'
import { reqBodyValidatorBuilder } from '../../helpers/index.js'
import { uidSchema } from '../middleware/validateUids.js'

const reportReasonSchema = Joi.string().valid(...Object.values(REPORT_REASONS))
  .messages({
    'any.only': 'El valor de reportReasonId es inválido',
    'any.required': 'Debes proporcionar un valor de reportReasonId'
  })

const createReportSchema = Joi.object({
  reportReasonId: reportReasonSchema.required()
})

const closeReportSchema = Joi.object({
  reportId: uidSchema.label('El reportId'),
  reportReasonId: reportReasonSchema
}).xor('reportId', 'reportReasonId').messages({
  'object.xor': 'Solo puedes indicar uno de los campos: el reportId o el reportReasonId',
  'object.missing': 'Debes indicar un valor o para reportId o para reportReasonId'
})

const validateCreateReport = async ({ body }) => await createReportSchema.validateAsync(body)
const validateIgnoreReport = async ({ body }) => await closeReportSchema.validateAsync(body)

const transform = async ({ body, method }) => {
  if (method === 'POST') {
    body.reportId = getUUID()
    body.relationshipId = getUUID()
  }
  return body
}

const createReportDto = reqBodyValidatorBuilder(validateCreateReport, transform)
const closeReportDto = reqBodyValidatorBuilder(validateIgnoreReport)

export { createReportDto, closeReportDto, reportReasonSchema }
