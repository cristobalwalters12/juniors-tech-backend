import express from 'express'
import { getUsersController, createUserjwtController, getUserByUsernameController, updateUserController } from '../../api/v1/controllers/usuarioController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: usuarios
 *   description: manejo de los usuarios
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
 *     usuarios:
 *       type: object
 *       required:
 *         - username
 *         - avatar
 *         - countryId
 *         - score
 *         - itFieldId
 *         - openToWork
 *         - languages
 *         - technologies
 *       properties:
 *         id:
 *           type: string
 *           description: id delusuario
 *         username:
 *           type: string
 *           description: username del usuario
 *         avatar:
 *           type: string
 *           description: Avatar del usuario
 *         countryId:
 *           type: string
 *           description: Pais del usuario
 *         score:
 *           type: Number
 *           description: Puntaje del usuario
 *         itFieldId:
 *           type: string
 *           description: Desempeño del usuario
 *         openToWork:
 *           type: boolean
 *           description: Estado actual del usuario
 *         languages:
 *           type: string
 *           description: Lenguaje de programacion del usuario
 *         technologies:
 *           type: string
 *           description: tecnologias del usuario
 *       example:
 *         username: Jayne_Kuhic
 *         avatar: https://docs.material-tailwind.com/img/face-3.jpg
 *         countryId: chile
 *         score: 0
 *         itFieldId: MDfP4QzwC8
 *         openToWork: True
 *         languages: GmF16qvoh5
 *         technologies: _84RNpgyTx
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: retornar todos los usuarios
 *     tags: [usuarios]
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
 *                     $ref: '#/components/schemas/usuarios'
 */

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: retorna un usuario por username
 *     tags: [usuarios]
 *   parameters:
 *     - in: path
 *       name: username
 *       schema:
 *         type: string
 *       required: true
 *       description: username del usuario
 *   responses:
 *     200:
 *       description: retorna un usuario por username
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario.
 *         username:
 *           type: string
 *           description: Nombre de usuario del usuario.
 *         score:
 *           type: number
 *           description: Puntuación del usuario.
 *         postCount:
 *           type: number
 *           description: Cantidad de publicaciones del usuario.
 *         commentCount:
 *           type: number
 *           description: Cantidad de comentarios del usuario.
 *         openToWork:
 *           type: boolean
 *           description: Indica si el usuario está abierto a oportunidades laborales.
 *         about:
 *           type: string
 *           description: Descripción o información sobre el usuario.
 *         employmentStatusId:
 *           type: string
 *           description: ID del estado laboral del usuario.
 *         pronoun:
 *           type: string
 *           description: Pronombre del usuario.
 *         avatarUrl:
 *           type: string
 *           description: URL del avatar del usuario.
 *         countryId:
 *           type: string
 *           description: ID del país del usuario.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario.
 *         mutedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha en la que el usuario fue silenciado.
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de los idiomas que habla el usuario.
 *         itFieldId:
 *           type: string
 *           description: ID del campo de TI en el que trabaja el usuario.
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de las tecnologías que utiliza el usuario.
 *         education:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de la educación del usuario.
 *         social_networks:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de URLs de las redes sociales del usuario.
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de los roles del usuario.
 *       example:
 *         id: abc123
 *         username: usuario123
 *         score: 100
 *         postCount: 10
 *         commentCount: 20
 *         openToWork: true
 *         about: Lorem ipsum dolor sit amet...
 *         employmentStatusId: emp123
 *         pronoun: they/them
 *         avatarUrl: http://example.com/avatar.png
 *         countryId: country123
 *         createdAt: '2024-04-06T12:00:00Z'
 *         mutedAt: '2024-04-05T12:00:00Z'
 *         languages:
 *           - GmF16qvoh5
 *           - zMnto3e8tN
 *         itFieldId: MDfP4QzwC8
 *         technologies:
 *           - _84RNpgyTx
 *           - _mnxA7nz8c
 *         education:
 *           - UWLfRUVGkb
 *           - HfozUT_PsC
 *         social_networks:
 *           - 7jstZPmPng
 *           - ep54y-_428
 *         roles: 2SbUCqylYo
 *     404:
 *       description: El usuario no existe
 */

/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     summary: Crear cuenta
 *     tags: [usuarios]
 *     requestBody:
 *       requerid: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               birthdate:
 *                 type: Date
 *             example:
 *               email: quetalamigo@hola.com
 *               password: "Ahorasiquesi8"
 *               username: jonathan
 *               birthdate: 1991-07-07
 *     responses:
 *       200:
 *         description: Cuenta creada con éxito
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *             avatar:
 *               type: string
 *             roles:
 *               type: string
 *             token:
 *               type: string
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               open_to_work:
 *                 type: boolean
 *                 description: Abierto a ofertas de tranajo.
 *               about:
 *                 type: string
 *                 description: Acerca del usuario.
 *               employment_status_id:
 *                 type: string
 *                 description: Estado del usuario.
 *               pronoun_id:
 *                 type: string
 *                 description: Pronombre del usuario.
 *               avatar_url:
 *                 type: string
 *                 description: Url de avatar del usuario.
 *               country_id:
 *                 type: string
 *                 description: Pais del usuario.
 *               language:
 *                 type: string
 *                 description: Lenguage de programacion del usuario.
 *               it_field_id:
 *                 type: string
 *                 description: Desempeño del usuario.
 *               technology:
 *                 type: string
 *                 description:  del usuario.
 *               education:
 *                 type: string
 *                 description: Formacion del usuario.
 *               social_network:
 *                 type: string
 *                 description: Redes sociales del usuario.
 *             example:
 *               open_to_work: true
 *               about: "estoy asombrado"
 *               employmentStatusId: "1ievtJUwmI"
 *               pronoun: "X_cRRyLmCz"
 *               avatarUrl: String
 *               countryId: "94y8Bc8cHe"
 *               languages: "GmF16qvoh5"
 *               itFieldId: "MDfP4QzwC8"
 *               technologies: "_84RNpgyTx"
 *               education: "UWLfRUVGkb"
 *               social_networks: "7jstZPmPng"
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado
 *                 user:
 *                   $ref: '#/components/schemas/usuarios'
 *       '403':
 *         description: El ID del token no coincide con el ID del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: El ID del token no coincide con el ID del usuario
 *       '404':
 *         description: Usuario no encontrado o está silenciado/eliminado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: El usuario no existe
 *       '500':
 *         description: Error al actualizar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar el usuario
 */

router.get('/users', getUsersController)
router.get('/users/:username', getUserByUsernameController)
router.put('/users/:id', updateUserController)
router.post('/users', createUserjwtController)
