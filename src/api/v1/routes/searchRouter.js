import { Router } from 'express'
import { searchController } from '../controllers/searchController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler
} from '../middleware/index.js'

const router = Router()
router.get('/', errorCatcher(searchController)).all(methodNotAllowedHandler)

export default router
