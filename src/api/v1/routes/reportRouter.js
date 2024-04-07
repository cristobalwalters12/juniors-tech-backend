import { Router } from 'express'
import { methodNotAllowedHandler, requireLoggedIn, restrictToRoles } from '../middleware/index.js'
import { errorCatcher } from '../../helpers/index.js'
import { getPostTypeReports, getCommentTypeReports } from '../controllers/reportController.js'
import { ROLE_TYPES } from '../../../config/index.js'

const router = Router()

router
  .route('/posts')
  .get([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ])], errorCatcher(getPostTypeReports))
  .all(methodNotAllowedHandler)

router
  .route('/comments')
  .get([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ])], errorCatcher(getCommentTypeReports))
  .all(methodNotAllowedHandler)

export default router
