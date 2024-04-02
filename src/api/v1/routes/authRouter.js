import { Router } from 'express'
import {
  loginUser,
  logoutUser,
  refreshToken
} from '../controllers/authController.js'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler } from '../middleware/index.js'
import { loginDto } from '../dtos/loginDto.js'

const router = Router()

router
  .route('/login')
  .post(loginDto, errorCatcher(loginUser))
  .all(methodNotAllowedHandler)

router
  .route('/logout')
  .get(errorCatcher(logoutUser))
  .all(methodNotAllowedHandler)

router
  .route('/refresh')
  .get(errorCatcher(refreshToken))
  .all(methodNotAllowedHandler)

export default router
