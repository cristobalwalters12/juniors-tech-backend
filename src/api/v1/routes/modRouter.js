import { Router } from 'express'
import {
  checkForReportOfType,
  findAndSetReport,
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
import { ignoreReport } from '../controllers/reportController.js'

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

router
  .route('/reports/:reportId')
  .delete([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ]),
    validateUids(['reportId']),
    findAndSetReport
  ], errorCatcher(ignoreReport))
  .all(methodNotAllowedHandler)

export default router
