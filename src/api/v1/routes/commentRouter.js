import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment } from '../controllers/commentController.js'

const router = Router({ mergeParams: true })
router
  .route('/')
  .post([mockUser, commentDto], errorCatcher(createComment))

export default router
