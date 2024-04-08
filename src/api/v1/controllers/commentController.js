import { voteById } from '../models/votingModel.js'
import { create, getAll, updateById, deleteById } from '../models/commentModel.js'
import { closeReportsByReasonId, createReport } from '../models/reportModel.js'
import { REPORT_ACTIONS, REPORT_TYPES } from '../../../config/index.js'

const createComment = async (req, res) => {
  const data = await create({
    postId: req.params.postId,
    currUserId: req.user.id,
    ...req.body
  })

  res.status(201).json({
    status: 'success',
    data
  })
}

const getComments = async (req, res) => {
  const data = await getAll({
    postId: req.params.postId,
    currUserId: req.user.id
  })

  res.status(200).json({
    status: 'success',
    data
  })
}

const editCommentById = async (req, res) => {
  const data = await updateById({
    commentId: req.params.commentId,
    currUserId: req.user.id,
    ...req.body
  })

  res.status(200).json({
    status: 'success',
    data
  })
}

const deleteCommentById = async (req, res) => {
  await deleteById(req.params.commentId)
  res.sendStatus(204)
}

const voteCommentById = async (req, res) => {
  await voteById({
    aspectId: req.params.commentId,
    authorId: req.resource.ownerId,
    currUserId: req.user.id,
    ...req.body
  })
  res.sendStatus(204)
}

const reportCommentById = async (req, res) => {
  const data = await createReport({
    reportId: req.body.reportId,
    reportedBy: req.user.id,
    reportedItemId: req.params.commentId,
    reportType: REPORT_TYPES.COMMENT,
    reportRelationshipId: req.body.relationshipId,
    reportReasonId: req.body.reportReasonId
  })
  res.status(201).json({
    status: 'success',
    data
  })
}

const ignoreCommentReportsByReason = async (req, res) => {
  const data = await closeReportsByReasonId({
    reportType: REPORT_TYPES.POST,
    reportActionId: REPORT_ACTIONS.IGNORE_REPORT,
    reportReasonId: req.body.reportReasonId,
    reportedItemId: req.params.commentId
  })
  res.status(200).json({
    status: 'success',
    data
  })
}

export {
  createComment,
  getComments,
  editCommentById,
  deleteCommentById,
  voteCommentById,
  reportCommentById,
  ignoreCommentReportsByReason
}
