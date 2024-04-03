import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler, uidValidator } from '../middleware/index.js'
import { createPost, getPostById, getPosts } from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'

const router = Router()

router
  .route('/')
  .post(postDto, errorCatcher(createPost))
  .get(getPosts)
  .all(methodNotAllowedHandler)

router
  .route('/:id')
  .get(uidValidator, errorCatcher(getPostById))

export default router
