import { Router } from 'express'
import { errorCatcher } from '../../helpers/index.js'
import { mockUser } from '../middleware/mockUser.js'
import { commentDto } from '../dtos/commentDto.js'
import { createComment } from '../controllers/commentController.js'
import { canCreateComment } from '../middleware/existenceValidators.js'

const router = Router({ mergeParams: true })

router
  .route('/')
  .post([
    mockUser,
    commentDto,
    canCreateComment
  ], errorCatcher(createComment))

export default router
