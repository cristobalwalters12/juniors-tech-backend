import { Router } from 'express'
import {
  createUserjwtController,
  getUsersController,
  getUserByUsernameController,
  updateUserController,
  getMods,
  promoteUserToMod
} from '../controllers/userController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler,
  jwtValidator,
  requireLoggedIn,
  restrictToRoles,
  findAndSetUser,
  canBeMod
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'
import { ROLE_TYPES } from '../../../config/index.js'

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
  .all(methodNotAllowedHandler)

router.put('/:id', jwtValidator, errorCatcher(updateUserController)).all(methodNotAllowedHandler)

export default router
