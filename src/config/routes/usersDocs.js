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
 *           description: id user
 *         username:
 *           type: string
 *           description: The user's username
 *         avatar:
 *           type: string
 *           description: The user's avatar
 *         countryId:
 *           type: string
 *           description: The user's country
 *         score:
 *           type: Number
 *           description: The user's score
 *         itFieldId:
 *           type: string
 *           description: The user's it filed
 *         openToWork:
 *           type: boolean
 *           description: The user's open to work
 *         languages:
 *           type: string
 *           description: The user's lenguages
 *         technologies:
 *           type: string
 *           description: The user's technologies
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
 * /usuarios:
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
 * /usuarios/sign-up:
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
 * /usuarios/{username}:
 *   get:
 *     summary: retorna un usuario por username
 *     tags: [usuarios]
 *   parameters:
 *     - in: path
 *       name: username
 *       schema:
 *         type: string
 *       required: true
 *       description: usuario username
 *   responses:
 *     200:
 *       description: retorna un usuario por username
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/components/schemas/usuarios'
 *     400:
 *       description: bad request
 */

/**
 * @swagger
 * /usuarios/{id}:
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
 *               openToWork:
 *                 type: boolean
 *                 description: Abierto a ofertas de tranajo.
 *               about:
 *                 type: string
 *                 description: Acerca del usuario.
 *               employmentStatusId:
 *                 type: string
 *                 description: Estado del usuario.
 *               pronoun:
 *                 type: string
 *                 description: Pronombre del usuario.
 *               avatarUrl:
 *                 type: string
 *                 description: Url de avatar del usuario.
 *               countryId:
 *                 type: string
 *                 description: Pais del usuario.
 *               languages:
 *                 type: string
 *                 description: Lenguage de programacion del usuario.
 *               itFieldId:
 *                 type: string
 *                 description: Desempeño del usuario.
 *               technologies:
 *                 type: string
 *                 description:  del usuario.
 *               education:
 *                 type: string
 *                 description: Formacion del usuario.
 *               social_networks:
 *                 type: string
 *                 description: Redes sociales del usuario.
 *             example:
 *               openToWork: true
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

router.get('/usuarios', getUsersController)
router.get('/usuarios/:username', getUserByUsernameController)
router.put('/usuarios/:id', updateUserController)
router.post('/usuarios', createUserjwtController)
