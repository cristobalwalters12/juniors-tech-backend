import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment, getComments, editCommentById } from '../controllers/commentController.js'
import { canCreateComment, commentExists, postExists } from '../middleware/existenceValidators.js'
import { methodNotAllowedHandler } from '../middleware/methodNotAllowedHandler.js'
import { validateUids } from '../middleware/validateUids.js'

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
    canCreateComment
  ], errorCatcher(createComment))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId')
  .put([
    validateUids(['postId', 'commentId']),
    commentExists,
    mockUser
  ], errorCatcher(editCommentById))
  .all(methodNotAllowedHandler)

export default router
