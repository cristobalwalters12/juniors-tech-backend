import { Router } from 'express'
import { loginUser } from '../controllers/authController.js'
import { errorCatcher } from '../../helpers/index.js'
import { methodNotAllowedHandler } from '../middleware/index.js'
import { loginDto } from '../dtos/loginDto.js'

const router = Router()

router
  .route('/login')
  .post(loginDto, errorCatcher(loginUser))
  .all(methodNotAllowedHandler)

export default router
