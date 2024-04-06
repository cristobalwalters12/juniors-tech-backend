import { Router } from 'express'
import { searchMiscController } from '../controllers/miscController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler
} from '../middleware/index.js'

const router = Router()
router.post('/search', errorCatcher(searchMiscController)).all(methodNotAllowedHandler)

export default router
