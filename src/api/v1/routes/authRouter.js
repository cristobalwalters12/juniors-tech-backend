import { Router } from 'express'
import { loginUser, changePasswordController } from '../controllers/authController.js'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler } from '../middleware/index.js'
import { loginDto } from '../dtos/loginDto.js'
import { changePasswordDto } from '../dtos/passwordDto.js'
import { jwtValidator } from '../middleware/jwtValidator.js'

const router = Router()

router
  .route('/login')
  .post(loginDto, errorCatcher(loginUser))
  .all(methodNotAllowedHandler)

router
  .route('/change-password')
  .post(jwtValidator, changePasswordDto, errorCatcher(changePasswordController))
  .all(methodNotAllowedHandler)
export default router
