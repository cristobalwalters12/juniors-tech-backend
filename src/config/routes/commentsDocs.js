import express from 'express'
import { createComment, getComments, editCommentById } from '../../api/v1/controllers/commentController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: manejo de comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del comentario
 *         postId:
 *           type: string
 *           description: ID de la publicación a la que pertenece el comentario
 *         parentId:
 *           type: string
 *           description: ID del comentario padre (si es una respuesta a otro comentario)
 *         body:
 *           type: string
 *           description: Contenido del comentario
 *         authorId:
 *           type: string
 *           description: ID del autor del comentario
 *         authorUsername:
 *           type: string
 *           description: Nombre de usuario del autor del comentario
 *         avatarUrl:
 *           type: string
 *           description: URL del avatar del autor del comentario
 *         voteCount:
 *           type: number
 *           description: Número de votos del comentario
 *         commentCount:
 *           type: number
 *           description: Número de respuestas al comentario
 *         createdAt:
 *           type: string
 *           description: Fecha de creación del comentario
 *         updatedAt:
 *           type: string
 *           description: Fecha de última actualización del comentario
 *         deletedAt:
 *           type: string
 *           description: Fecha de eliminación del comentario (si está eliminado)
 *         hasOpenReport:
 *           type: boolean
 *           description: Indica si el comentario tiene un reporte abierto
 *
 *     CommentCreationSuccessResponse:
 *       description: Comentario creado exitosamente
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentResponse'
 *
 *     CommentErrorResponse:
 *       description: Error al crear el comentario
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
 * /posts/{postId}/comments:
 *   post:
 *     summary: Crear un nuevo comentario en una publicación
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación en la que se creará el comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: string
 *                 description: ID del comentario padre (si existe)
 *               body:
 *                 type: string
 *                 description: Cuerpo del comentario
 *     responses:
 *       '201':
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentCreationSuccessResponse'
 *       '400':
 *         description: Error en la solicitud, revise los parámetros
 *       '401':
 *         description: No autorizado, se requiere token de autenticación
 *       '500':
 *         description: Error interno del servidor, inténtelo de nuevo más tarde
 */

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Actualizar un comentario existente por ID
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación del comentario
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: string
 *                 description: ID del comentario padre
 *               body:
 *                 type: string
 *                 description: Cuerpo del comentario
 *     responses:
 *       '200':
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       '400':
 *         description: Error en la solicitud, revise los parámetros
 *       '401':
 *         description: No autorizado, se requiere token de autenticación
 *       '404':
 *         description: Comentario no encontrado o no autorizado para editarlo
 *       '500':
 *         description: Error interno del servidor, inténtelo de nuevo más tarde
 */

router.post('/posts/:postId/comments', createComment)
router.post('/posts/:postId/comments', getComments)
router.post('/posts/:postId/comments', editCommentById)
