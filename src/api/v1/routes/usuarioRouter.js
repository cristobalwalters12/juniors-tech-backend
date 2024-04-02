import { Router } from 'express'
import {
  createUser,
  getUserByEmail
} from '../controllers/usuarioController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  jwtValidator,
  methodNotAllowedHandler
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'

const router = Router()

router
  .route('/')
  .get(jwtValidator, errorCatcher(getUserByEmail))
  .post(registerDto, errorCatcher(createUser))
  .all(methodNotAllowedHandler)

export default router
