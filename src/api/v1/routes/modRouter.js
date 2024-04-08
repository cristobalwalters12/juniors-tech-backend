import { Router } from 'express'
import {
  checkForReportOfType,
  methodNotAllowedHandler,
  postExists,
  requireLoggedIn,
  restrictToRoles,
  validateUids
} from '../middleware/index.js'
import { errorCatcher } from '../../helpers/index.js'
import { REPORT_TYPES, ROLE_TYPES } from '../../../config/index.js'
import { deletePostById } from '../controllers/postController.js'
import { closeReportDto } from '../dtos/reportDto.js'

const router = Router()

router
  .route('/posts/:postId')
  .delete([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ]),
    validateUids(['postId']),
    postExists,
    closeReportDto,
    checkForReportOfType(REPORT_TYPES.POST)
  ], errorCatcher(deletePostById))
  .all(methodNotAllowedHandler)

export default router
