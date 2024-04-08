import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import {
  restrictToOwner,
  protectReportedFromEdit,
  methodNotAllowedHandler,
  postExists,
  validateUids,
  requireLoggedIn,
  setUserIfLoggedIn,
  isMuted,
  restrictToRoles,
  canCloseReport
} from '../middleware/index.js'
import {
  createPost,
  getPostById,
  getPosts,
  editPostById,
  deletePostById,
  votePostById,
  reportPostById,
  ignorePostReportsByReason
} from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'
import { ROLE_TYPES } from '../../../config/index.js'
import { voteDto } from '../dtos/voteDto.js'
import { createReportDto, closeReportDto } from '../dtos/reportDto.js'

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
    restrictToOwner
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

router
  .route('/:postId/report')
  .post([
    requireLoggedIn,
    validateUids(['postId']),
    postExists,
    createReportDto
  ], errorCatcher(reportPostById))
  .delete([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ]),
    validateUids(['postId']),
    postExists,
    closeReportDto,
    canCloseReport
  ], errorCatcher(ignorePostReportsByReason))
  .all(methodNotAllowedHandler)

export default router
