import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment, getComments, editCommentById } from '../controllers/commentController.js'
import { canCreateComment, postExists } from '../middleware/existenceValidators.js'
import { methodNotAllowedHandler } from '../middleware/methodNotAllowedHandler.js'

const router = Router({ mergeParams: true })

router
  .route('/')
  .get([postExists, mockUser, errorCatcher(getComments)])
  .post([
    mockUser,
    commentDto,
    canCreateComment
  ], errorCatcher(createComment))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId')
  .put(mockUser, errorCatcher(editCommentById))
  .all(methodNotAllowedHandler)

export default router
