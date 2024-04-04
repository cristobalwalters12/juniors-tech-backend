import { Router } from 'express'
import { createUserjwtController, getUsersController, getUserByUsernameController } from '../controllers/usuarioController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'

const router = Router()
router.post('/sign-up', registerDto, errorCatcher(createUserjwtController)).all(methodNotAllowedHandler)
router.get('/users', errorCatcher(getUsersController)).all(methodNotAllowedHandler)
router.get('/:username', errorCatcher(getUserByUsernameController)).all(methodNotAllowedHandler)
export default router
