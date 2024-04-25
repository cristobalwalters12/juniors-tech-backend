import { Router } from 'express'
import {
  createUserjwtController,
  getUsersController,
  getUserByUsernameController,
  updateUserController,
  getMods,
  reportUser,
  desactivateUserController,
  desactivateMyAccountController,
  getPostbyIdUserController
} from '../controllers/userController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler,
  jwtValidator,
  requireLoggedIn,
  findAndSetUser
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'
import { createReportDto } from '../dtos/reportDto.js'

const router = Router()
router.post('/sign-up', registerDto, errorCatcher(createUserjwtController)).all(methodNotAllowedHandler)
router.get('/', errorCatcher(getUsersController)).all(methodNotAllowedHandler)

router.get('/mods', [
  requireLoggedIn
], errorCatcher(getMods))
  .all(methodNotAllowedHandler)

router.get('/:username', errorCatcher(getUserByUsernameController)).all(methodNotAllowedHandler)
router.get('/:id/posts', errorCatcher(getPostbyIdUserController)).all(methodNotAllowedHandler)

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
router.put('/:id/desactivateAccount', jwtValidator, errorCatcher(desactivateMyAccountController)).all(methodNotAllowedHandler)
export default router
