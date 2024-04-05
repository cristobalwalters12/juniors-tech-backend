import { Router } from 'express'
import { createUserjwtController, getUsersController, getUserByUsernameController, updateUserController } from '../controllers/usuarioController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler, jwtValidator
} from '../middleware/index.js'
import { registerDto } from '../dtos/registerDto.js'

const router = Router()
router.post('/sign-up', registerDto, errorCatcher(createUserjwtController)).all(methodNotAllowedHandler)
router.get('/users', errorCatcher(getUsersController)).all(methodNotAllowedHandler)
router.get('/:username', errorCatcher(getUserByUsernameController)).all(methodNotAllowedHandler)
router.put('/:id', jwtValidator, errorCatcher(updateUserController)).all(methodNotAllowedHandler)
export default router
