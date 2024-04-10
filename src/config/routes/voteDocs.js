import express from 'express'
import { votePostById, voteCommentById } from '../../api/v1/controllers/commentController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Votos
 *   description: manejo de votos
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     VoteRequestBody:
 *       type: object
 *       properties:
 *         voteDirection:
 *           type: number
 *           description: Dirección del voto (-1 para negativo, 0 para neutro, 1 para positivo)
 *       required:
 *         - voteDirection
 *
 *   responses:
 *     VoteSuccessResponse:
 *       description: Voto registrado exitosamente
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje de confirmación del voto
 *               voteDirection:
 *                 type: number
 *                 description: Dirección del voto registrado (-1, 0, 1)
 *
 *     VoteErrorResponse:
 *       description: Error al procesar el voto
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensaje de error
 */

/**
 * @swagger
 * /posts/{postId}/vote:
 *   post:
 *     summary: Votar por una publicación
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación a votar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteRequestBody'
 *     responses:
 *       '204':
 *         description: Voto registrado exitosamente
 *       '400':
 *         description: Error en la solicitud, revise los parámetros
 *       '401':
 *         description: No autorizado, token JWT inválido
 *       '500':
 *         description: Error interno del servidor, inténtelo de nuevo más tarde
 */

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/vote:
 *   post:
 *     summary: Votar por un comentario
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID de la publicación.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario para votar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteDirection:
 *                 type: integer
 *                 description: Dirección del voto (-1 para negativo, 1 para positivo).
 *     responses:
 *       '204':
 *         description: El voto se registró con éxito para el comentario.
 *       '400':
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   description: Código de error.
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       '401':
 *         description: No autorizado, el usuario no tiene permisos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   description: Código de error.
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       '404':
 *         description: El comentario no existe o no se encontró.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   description: Código de error.
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error interno del servidor.
 */

router.post('/posts', votePostById)
router.post('/posts/:postId/comments/:commentId/vote', voteCommentById)
