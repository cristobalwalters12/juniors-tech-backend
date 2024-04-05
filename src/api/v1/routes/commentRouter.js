import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment, getComments, editCommentById, deleteCommentById } from '../controllers/commentController.js'
import {
  postExists,
  validateUids,
  methodNotAllowedHandler,
  isReported,
  restrictToOwner,
  canReply,
  findAndSetComment
} from '../middleware/index.js'

const router = Router({ mergeParams: true })

router
  .route('/')
  .get([
    validateUids(['postId']),
    postExists,
    mockUser
  ], errorCatcher(getComments))
  .post([
    validateUids(['postId']),
    mockUser,
    commentDto,
    canReply
  ], errorCatcher(createComment))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId')
  .put([
    validateUids(['postId', 'commentId']),
    findAndSetComment,
    mockUser,
    restrictToOwner,
    isReported
  ], errorCatcher(editCommentById))
  .delete(errorCatcher(deleteCommentById))
  .all(methodNotAllowedHandler)

export default router
