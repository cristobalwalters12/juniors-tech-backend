import express from 'express'
import { searchController } from '../../api/v1/controllers/searchController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Buscador
 *   description: manejo de Busqueda
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Buscar elementos en múltiples categorías
 *     tags: [Buscador]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Nombre del país a buscar
 *       - in: query
 *         name: technology
 *         schema:
 *           type: string
 *         description: Nombre de la tecnología a buscar
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Nombre del idioma a buscar
 *       - in: query
 *         name: aspectType
 *         schema:
 *           type: string
 *         description: Tipo de aspecto a buscar
 *       - in: query
 *         name: education
 *         schema:
 *           type: string
 *         description: Nivel de educación a buscar
 *       - in: query
 *         name: employmentStatus
 *         schema:
 *           type: string
 *         description: Estado de empleo a buscar
 *       - in: query
 *         name: itField
 *         schema:
 *           type: string
 *         description: Campo de TI a buscar
 *       - in: query
 *         name: pronoun
 *         schema:
 *           type: string
 *         description: Pronombre a buscar
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Rol a buscar
 *       - in: query
 *         name: socialNetwork
 *         schema:
 *           type: string
 *         description: Red social a buscar
 *       - in: query
 *         name: reportAction
 *         schema:
 *           type: string
 *         description: Acción de reporte a buscar
 *       - in: query
 *         name: reportReason
 *         schema:
 *           type: string
 *         description: Razón de reporte a buscar
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *         description: Tipo de reporte a buscar
 *     responses:
 *       '200':
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *
 *       '400':
 *         description: Error en la solicitud, revise los parámetros
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Error interno del servidor, inténtelo de nuevo más tarde
 */

router.post('/search', searchController)
