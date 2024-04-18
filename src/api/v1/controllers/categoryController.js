import { createNewCategory, getCategories, updateCategories, deleteCategory } from '../models/categoryModel.js'

const createCategoryController = async (req, res) => {
  try {
    const category = req.body
    const newCategory = await createNewCategory(category)
    res.status(201).json(newCategory)
  } catch (error) {
    if (error.message === 'La categoría ya existe') {
      res.status(400).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Error al crear la categoria' })
    }
  }
}
const getCategoriesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 100
    const categories = await getCategories(page, size)
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorias' })
  }
}

const updateCategoryController = async (req, res) => {
  try {
    const id = req.params.id
    const category = req.body
    await updateCategories(id, category)
    res.status(200).json({ message: 'Categoría actualizada correctamente' })
  } catch (error) {
    if (error.message === 'La categoría no existe') {
      res.status(404).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Error al actualizar la categoría' })
    }
  }
}

const deleteCategoryController = async (req, res) => {
  try {
    const id = req.params.id
    await deleteCategory(id)
    res.status(200).json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    if (error.message === 'La categoría no existe') {
      res.status(404).json({ message: error.message })
    } else if (error.message === 'La categoría "otros" no puede ser eliminada') {
      res.status(400).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Error al eliminar la categoría' })
    }
  }
}

export { createCategoryController, getCategoriesController, updateCategoryController, deleteCategoryController }
