// import { createUser } from '../../api/v1/controllers/usuarioController'
// import { getUsers } from '../../api/v1/models/usuarioModel'
import express from 'express'
import { getPosts, createPost } from '../../api/v1/controllers/postController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: posts
 *   description: manejo de publicaciones y comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     posts:
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
 *         - title: hola hola
 *         - body: como estamos
 *         - category: Hojas de vida
 *         - slug: /posts
 *         - authorUsername: bla
 *         - avatarUrl: http://bla.com
 *         - voteCount: 0
 *         - commentCount: 0
 *         - createdAt: 2024-04-05 10:30:45
 *         - updatedAt: 2024-04-06 10:30:45
 *         - hasOpenReport: False
 *         - voteDirection: 0
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear comentario
 *     tags:
 *       - posts
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
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: obtener todos las publicaciones
 *     tags: [posts]
 *     responses:
 *       '200':
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/posts'
 */

router.post('/posts', createPost)
router.get('/posts', getPosts)
