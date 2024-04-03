import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler } from '../middleware/methodNotAllowedHandler.js'
import { createPost } from '../controllers/postController.js'
import { postDto } from '../dtos/postDto.js'

const router = Router()

router
  .route('/')
  .post(postDto, errorCatcher(createPost))
  .all(methodNotAllowedHandler)

export default router
