import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler, uidValidator } from '../middleware/index.js'
import { createPost, getPostById, getPosts, editPostById } from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'
import { mockUser } from '../middleware/mockUser.js'

const router = Router()

router
  .route('/')
  .post(postDto, errorCatcher(createPost))
  .get(mockUser, getPosts)
  .all(methodNotAllowedHandler)

router
  .route('/:id')
  .get([mockUser, uidValidator], errorCatcher(getPostById))
  .put([uidValidator, postDto], errorCatcher(editPostById))
  .all(methodNotAllowedHandler)

export default router
