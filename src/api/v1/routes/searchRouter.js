import { Router } from 'express'
import { searchController, searchPosts, searchUsers } from '../controllers/searchController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler,
  setUserIfLoggedIn
} from '../middleware/index.js'
import { postSearchDto } from '../dtos/postQueryDto.js'
import { userSearchDto } from '../dtos/userQueryDto.js'

const router = Router()
router.get('/', errorCatcher(searchController)).all(methodNotAllowedHandler)

router.get('/posts',
  postSearchDto,
  setUserIfLoggedIn,
  errorCatcher(searchPosts)
).all(methodNotAllowedHandler)

router.get('/users',
  userSearchDto,
  errorCatcher(searchUsers)
).all(methodNotAllowedHandler)

export default router
