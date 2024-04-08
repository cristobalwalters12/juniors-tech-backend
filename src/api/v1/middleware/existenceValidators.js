import { REPORT_TYPES, getUUID } from '../../../config/index.js'
import { AppError } from '../../helpers/AppError.js'
import { existsById as commentExistsById, getAuthDataIfExists } from '../models/commentModel.js'
import { existsById as existsPostById } from '../models/postModel.js'
import { reportExistById } from '../models/reportModel.js'
import { getUserAuthDataIfExists } from '../models/userModel.js'

const postExists = async (req, res, next) => {
  const resource = await existsPostById(req.params.postId)
  if (resource === undefined) {
    return next(AppError.notFound('La publicación no existe'))
  }
  req.resource = resource
  next()
}

const canReply = async (req, res, next) => {
  const ancestorExists = await commentExistsById(req.body.parentId)
  if (!ancestorExists) {
    return next(AppError.notFound('La publicación o comentario al que intentas responder no existe'))
  }
  next()
}

const findAndSetComment = async (req, res, next) => {
  const comment = await getAuthDataIfExists({
    postId: req.params.postId,
    commentId: req.params.commentId
  })

  if (comment === undefined) {
    return next(AppError.notFound('El comentario no existe'))
  }

  req.resource = comment
  next()
}

const findAndSetUser = async (req, res, next) => {
  const user = await getUserAuthDataIfExists(req.params.username)
  if (user === undefined) {
    return next(AppError.notFound('El usuario no existe'))
  }
  req.resource = user
  next()
}

const findAndSetReport = async (req, res, next) => {
  const report = await reportExistById(req.params.reportId)

  if (report === undefined) {
    return next(AppError.notFound('El reporte no existe'))
  }

  if (!report.isOpen) {
    return next(AppError.badRequest('El reporte ya está cerrado'))
  }

  req.report = report
  const reportTypeName = Object.keys(REPORT_TYPES).find(
    type => REPORT_TYPES[type].id === report.reportTypeId
  )
  req.report.reportType = REPORT_TYPES[reportTypeName]
  next()
}

const checkForReportOfType = (reportType) => async (req, res, next) => {
  const reportId = req.body.reportId
  let report = {}
  if (reportId) {
    report = await reportExistById(reportId)
    if (report === undefined) {
      return next(AppError.notFound('El reporte no existe'))
    }
    if (!report.isOpen) {
      return next(AppError.badRequest('El reporte ya está cerrado'))
    }
    if (report.reportTypeId !== reportType.id ||
      report.reportedItemId !== req.resource.id
    ) {
      return next(AppError.badRequest('El reporte no corresponde al recurso'))
    }
    report.exists = true
  } else {
    report.reportId = getUUID()
    report.reportedBy = req.user.id
    report.reportTypeId = reportType.id
    report.reportReasonId = req.body.reportReasonId
    report.exists = false
  }
  report.reportRelationshipId = getUUID()
  report.reportType = reportType
  req.report = req.report ? { ...req.report, ...report } : report
  next()
}

export { postExists, canReply, findAndSetComment, findAndSetUser, findAndSetReport, checkForReportOfType }
