import { Router } from 'express'
import {
  createUserjwtController,
  getUsersController,
  getUserByUsernameController,
  updateUserController,
  getMods,
  promoteUserToMod,
  muteUser,
  demoteMod,
  reportUser,
  desactivateUserController
} from '../controllers/userController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler,
  jwtValidator,
  requireLoggedIn,
  restrictToRoles,
  findAndSetUser,
  canBeMod,
  canMuteUser,
  canDemoteMod,
  checkForReportOfType
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'
import { REPORT_TYPES, ROLE_TYPES } from '../../../config/index.js'
import { createReportDto } from '../dtos/reportDto.js'

const router = Router()
router.post('/sign-up', registerDto, errorCatcher(createUserjwtController)).all(methodNotAllowedHandler)
router.get('/', errorCatcher(getUsersController)).all(methodNotAllowedHandler)

router.get('/mods', [
  requireLoggedIn,
  restrictToRoles([
    ROLE_TYPES.MOD.name,
    ROLE_TYPES.ADMIN.name
  ])
], errorCatcher(getMods))
  .all(methodNotAllowedHandler)

router.get('/:username', errorCatcher(getUserByUsernameController)).all(methodNotAllowedHandler)

router
  .route('/:username/mod')
  .post([
    requireLoggedIn,
    restrictToRoles([ROLE_TYPES.ADMIN.name]),
    findAndSetUser,
    canBeMod
  ], errorCatcher(promoteUserToMod))
  .delete([
    requireLoggedIn,
    restrictToRoles([ROLE_TYPES.ADMIN.name]),
    findAndSetUser,
    canDemoteMod
  ], errorCatcher(demoteMod))
  .all(methodNotAllowedHandler)

router
  .route('/:username/mute')
  .post([
    requireLoggedIn,
    restrictToRoles([ROLE_TYPES.MOD.name, ROLE_TYPES.ADMIN.name]),
    findAndSetUser,
    canMuteUser,
    checkForReportOfType(REPORT_TYPES.USER)
  ], errorCatcher(muteUser))
  .all(methodNotAllowedHandler)

router
  .route('/:username/report')
  .post([
    requireLoggedIn,
    findAndSetUser,
    createReportDto
  ], errorCatcher(reportUser))
  .all(methodNotAllowedHandler)

router.put('/:id', jwtValidator, errorCatcher(updateUserController)).all(methodNotAllowedHandler)
router.put('/:id/desactivate', jwtValidator, errorCatcher(desactivateUserController)).all(methodNotAllowedHandler)
export default router
