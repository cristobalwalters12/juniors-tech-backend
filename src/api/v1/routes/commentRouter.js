import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment, getComments, editCommentById, deleteCommentById, voteCommentById } from '../controllers/commentController.js'
import {
  postExists,
  validateUids,
  methodNotAllowedHandler,
  isReported,
  restrictToOwner,
  canReply,
  findAndSetComment,
  restrictToOwnerOrRoles
} from '../middleware/index.js'
import { ROLE_TYPES } from '../../../config/index.js'
import { voteDto } from '../dtos/voteDto.js'

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
  .delete([
    validateUids(['postId', 'commentId']),
    findAndSetComment,
    mockUser,
    restrictToOwnerOrRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ])
  ], errorCatcher(deleteCommentById))
  .all(methodNotAllowedHandler)

router
  .route('/:commentId/vote')
  .post([
    validateUids(['postId', 'commentId']),
    mockUser,
    findAndSetComment,
    voteDto
  ], errorCatcher(voteCommentById))
  .all(methodNotAllowedHandler)

export default router
