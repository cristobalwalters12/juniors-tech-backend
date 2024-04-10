import { REPORT_ACTIONS, REPORT_TYPES } from '../../../config/index.js'
import { getPagination } from '../../helpers/getPagination.js'
import { create, getById, getAll, updateById, deleteById } from '../models/postModel.js'
import { createReport, closeReasonRelatedReports, closeAllReportsByResourceId } from '../models/reportModel.js'
import { voteById } from '../models/votingModel.js'

const createPost = async (req, res) => {
  const data = await create({ ...req.body, currUserId: req.user.id })
  res.status(201).json({
    status: 'success',
    data
  })
}

const getPostById = async (req, res) => {
  const data = await getById({ postId: req.params.postId, currUserId: req?.user?.id })
  res.status(200).json({
    status: 'success',
    data
  })
}

const getPosts = async (req, res) => {
  const { posts, ...result } = await getAll({ currUserId: req?.user?.id, ...req.query })
  const pagination = getPagination(result)
  res.status(200).json({
    status: 'success',
    data: {
      posts,
      ...pagination
    }
  })
}

const editPostById = async (req, res) => {
  const data = await updateById({
    postId: req.params.postId,
    currUserId: req.user.id,
    ...req.body
  })
  res.status(200).json({
    status: 'success',
    data
  })
}

const deletePostById = async (req, res) => {
  const postId = req.params.postId

  if (req?.report?.exists === false) {
    await createReport({
      ...req.report,
      reportedItemId: postId
    })
  }

  await deleteById(postId)
  await closeAllReportsByResourceId({
    reportType: REPORT_TYPES.POST,
    reportActionId: REPORT_ACTIONS.DELETE_POST,
    reportedItemId: postId
  })

  res.sendStatus(204)
}

const votePostById = async (req, res) => {
  await voteById({
    aspectId: req.params.postId,
    authorId: req.resource.ownerId,
    currUserId: req.user.id,
    ...req.body
  })
  res.sendStatus(204)
}

const reportPostById = async (req, res) => {
  const data = await createReport({
    reportId: req.body.reportId,
    reportedBy: req.user.id,
    reportedItemId: req.params.postId,
    reportType: REPORT_TYPES.POST,
    reportRelationshipId: req.body.relationshipId,
    reportReasonId: req.body.reportReasonId
  })
  res.status(201).json({
    status: 'success',
    data
  })
}

const ignorePostReportsByReason = async (req, res) => {
  const data = await closeReasonRelatedReports({
    reportType: REPORT_TYPES.POST,
    reportActionId: REPORT_ACTIONS.IGNORE_REPORT,
    reportReasonId: req.body.reportReasonId,
    reportedItemId: req.params.postId
  })
  res.status(200).json({
    status: 'success',
    data
  })
}

export {
  createPost,
  getPostById,
  getPosts,
  editPostById,
  deletePostById,
  votePostById,
  reportPostById,
  ignorePostReportsByReason
}
