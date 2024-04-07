import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import {
  restrictToOwner,
  restrictToOwnerOrRoles,
  protectReportedFromEdit,
  methodNotAllowedHandler,
  postExists,
  validateUids,
  requireLoggedIn,
  setUserIfLoggedIn,
  isMuted
} from '../middleware/index.js'
import { createPost, getPostById, getPosts, editPostById, deletePostById, votePostById } from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'
import { ROLE_TYPES } from '../../../config/index.js'
import { voteDto } from '../dtos/voteDto.js'

const router = Router()

router
  .route('/')
  .post([requireLoggedIn, isMuted, postDto], errorCatcher(createPost))
  .get(setUserIfLoggedIn, getPosts)
  .all(methodNotAllowedHandler)

router
  .route('/:postId')
  .get([validateUids(['postId']), setUserIfLoggedIn], errorCatcher(getPostById))
  .put([
    requireLoggedIn,
    validateUids(['postId']),
    postExists,
    restrictToOwner,
    isMuted,
    protectReportedFromEdit,
    postDto
  ], errorCatcher(editPostById))
  .delete([
    requireLoggedIn,
    validateUids(['postId']),
    postExists,
    restrictToOwnerOrRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ])
  ], errorCatcher(deletePostById))
  .all(methodNotAllowedHandler)

router
  .route('/:postId/vote')
  .post([
    requireLoggedIn,
    validateUids(['postId']),
    postExists,
    voteDto
  ], errorCatcher(votePostById))
  .all(methodNotAllowedHandler)

export default router
