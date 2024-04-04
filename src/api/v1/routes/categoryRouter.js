import { Router } from 'express'
import { createCategoryController, getCategoriesController, updateCategoryController, deleteCategoryController } from '../controllers/categoryController.js'
import { errorCatcher } from '../../helpers/index.js'
import {
  methodNotAllowedHandler, TokenValidator
} from '../middleware/index.js'

const router = Router()
router.post('/', TokenValidator, errorCatcher(createCategoryController)).all(methodNotAllowedHandler)
router.get('/', errorCatcher(getCategoriesController)).all(methodNotAllowedHandler)
router.put('/:id', TokenValidator, errorCatcher(updateCategoryController)).all(methodNotAllowedHandler)
router.delete('/:id', TokenValidator, errorCatcher(deleteCategoryController)).all(methodNotAllowedHandler)
export default router
