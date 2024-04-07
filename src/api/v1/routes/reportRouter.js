import { Router } from 'express'
import { methodNotAllowedHandler, requireLoggedIn, restrictToRoles } from '../middleware/index.js'
import { errorCatcher } from '../../helpers/index.js'
import { getPostTypeReports } from '../controllers/reportController.js'
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

export default router
