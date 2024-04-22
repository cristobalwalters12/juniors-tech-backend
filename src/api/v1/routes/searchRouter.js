import { Router } from 'express'
import { searchController, searchPosts } from '../controllers/searchController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler,
  setUserIfLoggedIn
} from '../middleware/index.js'
import { postSearchDto } from '../dtos/postQueryDto.js'

const router = Router()
router.get('/', errorCatcher(searchController)).all(methodNotAllowedHandler)

router.get('/posts',
  postSearchDto,
  setUserIfLoggedIn,
  errorCatcher(searchPosts)
).all(methodNotAllowedHandler)

export default router
