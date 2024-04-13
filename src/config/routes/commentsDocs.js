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
 *         body:
 *           type: string
 *           description: Contenido del comentario
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
 *               $ref: '#/components/schemas/CommentResponse'
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
 *               body:
 *                 type: string
 *                 description: Cuerpo del comentario
 *           required:
 *             - body
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

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario por id
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Id de la publicacion.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Id del comentario a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: El comentario ha sido eliminado con éxito.
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
 *       '403':
 *         description: No tiene permisos para realizar esta acción.
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

router.post('/posts/:postId/comments', createComment)
router.get('/posts/:postId/comments', getComments)
router.post('/posts/:postId/comments', editCommentById)
router.delete('/posts/:postId/comments/:commentId', editCommentById)
