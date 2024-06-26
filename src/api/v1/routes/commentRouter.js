import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { createCommentDto, editCommentDto } from '../dtos/commentDto.js'
import {
  createComment,
  getComments,
  editCommentById,
  deleteCommentById,
  voteCommentById,
  reportCommentById
} from '../controllers/commentController.js'
import {
  postExists,
  validateUids,
  methodNotAllowedHandler,
  protectReportedFromEdit,
  restrictToOwner,
  canReply,
  findAndSetComment,
  setUserIfLoggedIn,
  requireLoggedIn,
  isMuted
} from '../middleware/index.js'
import { voteDto } from '../dtos/voteDto.js'
import { createReportDto } from '../dtos/reportDto.js'

const router = Router({ mergeParams: true })

router
  .route('/')
  .get([
    validateUids(['postId']),
    postExists,
    setUserIfLoggedIn
  ], errorCatcher(getComments))
  .post([
    validateUids(['postId']),
    requireLoggedIn,
    isMuted,
    canReply,
    createCommentDto
  ], errorCatcher(createComment))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId')
  .put([
    validateUids(['postId', 'commentId']),
    requireLoggedIn,
    findAndSetComment,
    restrictToOwner,
    protectReportedFromEdit,
    isMuted,
    editCommentDto
  ], errorCatcher(editCommentById))
  .delete([
    validateUids(['postId', 'commentId']),
    requireLoggedIn,
    findAndSetComment,
    restrictToOwner
  ], errorCatcher(deleteCommentById))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId/vote')
  .post([
    validateUids(['postId', 'commentId']),
    requireLoggedIn,
    findAndSetComment,
    voteDto
  ], errorCatcher(voteCommentById))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId/report')
  .post([
    requireLoggedIn,
    validateUids(['postId', 'commentId']),
    findAndSetComment,
    createReportDto
  ], errorCatcher(reportCommentById))
  .all(methodNotAllowedHandler)

export default router
