import { Router } from 'express'
import {
  canPromoteToMod,
  canDemoteMod,
  canMuteUser,
  checkForReportOfType,
  commentExists,
  findAndSetReport,
  findAndSetUser,
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
import { deleteCommentById } from '../controllers/commentController.js'
import { demoteMod, muteUser, promoteUserToMod } from '../controllers/userController.js'

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
  .route('/comments/:commentId')
  .delete([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ]),
    validateUids(['commentId']),
    commentExists,
    closeReportDto,
    checkForReportOfType(REPORT_TYPES.COMMENT)
  ], errorCatcher(deleteCommentById))
  .all(methodNotAllowedHandler)

router
  .route('/users/:username/mute')
  .post([
    requireLoggedIn,
    restrictToRoles([
      ROLE_TYPES.MOD.name,
      ROLE_TYPES.ADMIN.name
    ]),
    findAndSetUser,
    canMuteUser,
    closeReportDto,
    checkForReportOfType(REPORT_TYPES.USER)
  ], errorCatcher(muteUser))
  .all(methodNotAllowedHandler)

router
  .route('/users/:username/mod')
  .post([
    requireLoggedIn,
    restrictToRoles([ROLE_TYPES.ADMIN.name]),
    findAndSetUser,
    canPromoteToMod
  ], errorCatcher(promoteUserToMod))
  .delete([
    requireLoggedIn,
    restrictToRoles([ROLE_TYPES.ADMIN.name]),
    findAndSetUser,
    canDemoteMod
  ], errorCatcher(demoteMod))
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
