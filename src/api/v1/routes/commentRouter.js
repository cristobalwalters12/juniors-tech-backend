import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { createCommentDto, editCommentDto } from '../dtos/commentDto.js'
import { createComment, getComments, editCommentById, deleteCommentById, voteCommentById } from '../controllers/commentController.js'
import {
  postExists,
  validateUids,
  methodNotAllowedHandler,
  isReported,
  restrictToOwner,
  canReply,
  findAndSetComment,
  restrictToOwnerOrRoles,
  setUserIfLoggedIn,
  requireLoggedIn,
  isMuted
} from '../middleware/index.js'
import { ROLE_TYPES } from '../../../config/index.js'
import { voteDto } from '../dtos/voteDto.js'

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
    isReported,
    isMuted,
    editCommentDto
  ], errorCatcher(editCommentById))
  .delete([
    validateUids(['postId', 'commentId']),
    findAndSetComment,
    requireLoggedIn,
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
    requireLoggedIn,
    findAndSetComment,
    voteDto
  ], errorCatcher(voteCommentById))
  .all(methodNotAllowedHandler)

export default router
