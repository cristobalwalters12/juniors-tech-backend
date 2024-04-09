import express from 'express'
import { createComment, getComments } from '../../api/v1/routes/commentRouter'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: comment
 *   description: manejo de comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del comentario.
 *         postId:
 *           type: string
 *           description: ID de la publicación asociada al comentario.
 *         body:
 *           type: string
 *           description: Cuerpo del comentario.
 *         authorId:
 *           type: string
 *           description: ID del autor del comentario.
 *         authorUsername:
 *           type: string
 *           description: Nombre de usuario del autor del comentario.
 *         avatarUrl:
 *           type: string
 *           description: URL del avatar del autor del comentario.
 *         voteCount:
 *           type: number
 *           description: Número total de votos del comentario.
 *         commentCount:
 *           type: number
 *           description: Número total de respuestas/comentarios a este comentario.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del comentario.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del comentario.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que fue eliminado el comentario (null si no está eliminado).
 *         hasOpenReport:
 *           type: boolean
 *           description: Indica si el comentario tiene un reporte abierto.
 *         voteDirection:
 *           type: number
 *           description: Dirección del voto del usuario actual (1 para positivo, -1 para negativo, 0 si no votó).
 *     CommentResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Lista de comentarios.
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID de la publicación a comentar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: Cuerpo del comentario.
 *             example:
 *               body: Este es un comentario.
 *     responses:
 *       '201':
 *         description: Comentario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 */

router.post('/posts/:postId/comments', createComment)
router.post('/posts/:postId/comments', getComments)
