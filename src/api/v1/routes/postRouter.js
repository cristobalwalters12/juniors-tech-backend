import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { restrictToOwner, restrictToOwnerOrRoles, isReported, methodNotAllowedHandler, postExists, validateUids } from '../middleware/index.js'
import { createPost, getPostById, getPosts, editPostById, deletePostById, votePostById } from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'
import { mockUser } from '../middleware/mockUser.js'
import { ROLE_TYPES } from '../../../config/index.js'
import { voteDto } from '../dtos/voteDto.js'

const router = Router()

router
  .route('/')
  .post([mockUser, postDto], errorCatcher(createPost))
  .get(mockUser, getPosts)
  .all(methodNotAllowedHandler)

router
  .route('/:postId')
  .get([validateUids(['postId']), mockUser], errorCatcher(getPostById))
  .put([
    mockUser,
    validateUids(['postId']),
    postExists,
    restrictToOwner,
    isReported,
    postDto
  ], errorCatcher(editPostById))
  .delete([
    mockUser,
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
    mockUser,
    validateUids(['postId']),
    postExists,
    voteDto
  ], errorCatcher(votePostById))
  .all(methodNotAllowedHandler)

export default router
