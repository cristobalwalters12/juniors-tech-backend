import express from 'express'
import { getPosts, createPost, editPostById, deletePostById, getPostById } from '../../api/v1/controllers/postController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Publicaciones
 *   description: manejo de publicaciones

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Nuevo título de la publicación
 *         body:
 *           type: string
 *           description: Nuevo cuerpo de la publicación
 *         categoryId:
 *           type: string
 *           description: Nuevo ID de la categoría de la publicación
 *       required:
 *         - title
 *         - body
 *         - categoryId
 *     UpdatedPost:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la publicación actualizada
 *         title:
 *           type: string
 *           description: Título actualizado de la publicación
 *         body:
 *           type: string
 *           description: Cuerpo actualizado de la publicación
 *         categoryId:
 *           type: string
 *           description: ID de la categoría actualizada de la publicación
 *         slug:
 *           type: string
 *           description: Slug actualizado de la publicación
 *         authorId:
 *           type: string
 *           description: ID del autor de la publicación
 *         voteCount:
 *           type: number
 *           description: Cantidad de votos de la publicación
 *         commentCount:
 *           type: number
 *           description: Cantidad de comentarios de la publicación
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación de la publicación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de actualización de la publicación
 *         hasOpenReport:
 *           type: boolean
 *           description: Indicador de si la publicación tiene reportes abiertos
 *       example:
 *         title: hola hola
 *         body: como estamos
 *         category: Hojas de vida
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Publicaciones:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - body
 *         - category
 *         - slug
 *         - authorUsername
 *         - avatarUrl
 *         - voteCount
 *         - commentCount
 *         - createdAt
 *         - updatedAt
 *         - hasOpenReport
 *         - voteDirection
 *       properties:
 *         id: Number
 *         title:
 *           type: String
 *           description: Titulo de la publicacion
 *         body:
 *           type: String
 *           description: Cuerpo de la pubicacion
 *         category:
 *           type: String
 *           description: Categoria de la publicacion
 *         slug:
 *           type: Number
 *           description: Slug de la publicacion
 *         authorUsername:
 *           type: String
 *           description: Usuario de la publicacion
 *         avatarUrl:
 *           type: String
 *           description: Avatar del usuario
 *         voteCount:
 *           type: Number
 *           description: Voto de la publicacion
 *         commentCount:
 *           type: Number
 *           description: Total de comentarios
 *         createdAt:
 *           type: Date
 *           description: Fecha de la creacion de la publicacion
 *         updatedAt:
 *           type: Date
 *           description: Fecha de la actualizacion
 *         hasOpenReport:
 *           type: Boolean
 *           description: Con o sin reporte
 *         voteDirection:
 *           type: Number
 *           description: Direccion de votos
 *       example:
 *         title: hola hola
 *         body: como estamos
 *         category: L1w-xYdnDH
 *         authorUsername: bla
 *         avatarUrl: http://bla.com
 *         voteCount: 0
 *         commentCount: 0
 *         createdAt: 2024-04-05 10:30:45
 *         updatedAt: 2024-04-06 10:30:45
 *         hasOpenReport: False
 *         voteDirection: 0
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: obtener todos las publicaciones
 *     tags: [Publicaciones]
 *     responses:
 *       '200':
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Publicaciones'
 *       '404':
 *         description: Error al obtener todas las publicaciones
 */

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: obtener todos las publicaciones
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id de la publicacion
 *     responses:
 *       '200':
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicaciones'
 *       '404':
 *         description: Error al obtener todas las publicaciones
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear una publicacion
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la publicación
 *               body:
 *                 type: string
 *                 description: Cuerpo de la publicación
 *               categoryId:
 *                 type: string
 *                 description: ID de la categoría de la publicación
 *             example:
 *               title: "Hola"
 *               body: "Soy un body"
 *               categoryId: "L1w-xYdnDH"
 *     responses:
 *       200:
 *         description: Publicaciones creado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 */

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Actualizar una publicación por su ID
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *           required: true
 *           description: ID de la publicación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       '200':
 *         description: Publicación actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatedPost'
 *       '400':
 *         description: Error en la solicitud, revise los parámetros
 *       '401':
 *         description: No autorizado, token JWT inválido o no proporcionado
 *       '403':
 *         description: Prohibido, el usuario no tiene permiso para editar esta publicación
 *       '404':
 *         description: No se encontró la publicación con el ID especificado
 *       '500':
 *         description: Error interno del servidor, inténtelo de nuevo más tarde
 */

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Eliminar un post por su ID
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del post a eliminar
 *     responses:
 *       '204':
 *         description: Post eliminado exitosamente
 *       '404':
 *         description: El post con el ID proporcionado no fue encontrado
 *       '500':
 *         description: Error interno del servidor al eliminar el post
 */

router.get('/posts', getPosts)
router.get('/posts/:postId', getPostById)
router.post('/posts', createPost)
router.put('/posts/:postId', editPostById)
router.delete('/posts/:postId', deletePostById)
