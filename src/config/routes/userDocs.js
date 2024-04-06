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

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     user:
//  *       type: object
//  *       required:
//  *         - username
//  *         - avatar
//  *         - countryId
//  *         - score
//  *         - itFieldId
//  *         - openToWork
//  *         - languages
//  *         - technologies
//  *       properties:
//  *         id: Numb
//  *         username:
//  *           type: string
//  *           description: The user's username
//  *         avatar:
//  *           type: string
//  *           description: The user's avatar
//  *         countryId:
//  *           type: string
//  *           description: The user's country
//  *         score:
//  *           type: Number
//  *           description: The user's score
//  *         itFieldId:
//  *           type: string
//  *           description: The user's it filed
//  *         openToWork:
//  *           type: boolean
//  *           description: The user's open to work
//  *         languages:
//  *           type: string
//  *           description: The user's lenguages
//  *         technologies:
//  *           type: string
//  *           description: The user's technologies
//  *       example:
//  *         username: Jayne_Kuhic
//  *         avatar: https://docs.material-tailwind.com/img/face-3.jpg
//  *         countryId: chile
//  *         score: 0
//  *         itFieldId: sha
//  *         openToWork: True
//  *         languages: sda
//  *         technologies: asd
//  */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear comentario
 *     tags: [posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/posts'
 *       responses:
 *         200:
 *           description: new posts created
 *         400:
 *           description: bad request
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Take all the users
 *     tags: [user]
 *     responses:
 *       '200':
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/user'
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
 *                 items:
 *                   $ref: '#/components/schemas/posts'
 */

// /**
//  * @swagger
//  * /sign-up:
//  *   post:
//  *     summary: Crear cuenta
//  *     tags: [user]
//  *     requestBody:
//  *       requerid: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               birthdate:
//  *                 type: string
//  *                 format: date
//  *     responses:
//  *       200:
//  *         description: Cuenta creada con éxito
//  *         schema:
//  *           type: object
//  *           properties:
//  *             id:
//  *               type: string
//  *             username:
//  *               type: string
//  *             avatar:
//  *               type: string
//  *             roles:
//  *               type: string
//  *             token:
//  *               type: string
//  */

router.post('/posts', createPost)
router.get('/posts', getPosts)
