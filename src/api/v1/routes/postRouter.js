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
  .route('/:id')
  .get([validateUids(['id']), mockUser], errorCatcher(getPostById))
  .put([
    mockUser,
    validateUids(['id']),
    postExists,
    restrictToOwner,
    isReported,
    postDto
  ], errorCatcher(editPostById))
  .delete([
    mockUser,
    validateUids(['id']),
    postExists,
    restrictToOwnerOrRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ])
  ], errorCatcher(deletePostById))
  .all(methodNotAllowedHandler)

router
  .route('/:id/vote')
  .post([
    mockUser,
    validateUids(['id']),
    postExists,
    voteDto
  ], errorCatcher(votePostById))
  .all(methodNotAllowedHandler)

export default router
