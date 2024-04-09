import { voteById } from '../models/votingModel.js'
import { create, getAll, updateById, deleteById } from '../models/commentModel.js'
import { closeAllReportsByResourceId, createReport } from '../models/reportModel.js'
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
  const commentId = req.params.commentId

  if (req?.report?.exists === false) {
    await createReport({
      ...req.report,
      reportedItemId: commentId
    })
  }

  await deleteById(commentId)

  await closeAllReportsByResourceId({
    reportType: REPORT_TYPES.COMMENT,
    reportActionId: REPORT_ACTIONS.DELETE_COMMENT,
    reportedItemId: commentId
  })

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

export {
  createComment,
  getComments,
  editCommentById,
  deleteCommentById,
  voteCommentById,
  reportCommentById
}
