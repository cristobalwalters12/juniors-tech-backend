import express from 'express'
import { demoteMod, muteUser, promoteUserToMod } from '../../api/v1/controllers/userController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Administracion
 *   description: manejo de administrador y moderadores
 */

/**
 * @swagger
 * /mod/users/{username}/mod:
 *   post:
 *     summary: Promover usuario a moderador
 *     tags: [Administracion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Nombre de usuario del usuario a promover.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Usuario promovido exitosamente a moderador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Estado de la solicitud.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID del usuario promovido.
 *                     username:
 *                       type: string
 *                       description: Nombre de usuario del usuario promovido.
 *                     roles:
 *                       type: array
 *                       description: Lista de roles del usuario, incluyendo el nuevo rol de moderador.
 *                       items:
 *                         type: string
 *               example:
 *                 status: success
 *                 data:
 *                   id: ejemplo123
 *                   username: ejemplo_usuario
 *                   roles:
 *                     - usuario
 *                     - moderador
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

/**
 * @swagger
 * /mod/users/{username}/mod:
 *   delete:
 *     summary: Quitar rol de moderador a un usuario
 *     tags: [Administracion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Nombre de usuario del moderador a degradar.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Rol de moderador removido exitosamente.
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

/**
 * @swagger
 * /mod/users/{username}/mute:
 *   post:
 *     summary: Silenciar a un usuario
 *     tags: [Administracion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username del usuario que se va a silenciar.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: El usuario ha sido silenciado con éxito.
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
 *       '400':
 *         description: Error en la solicitud.
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
 *         description: El usuario no existe o ya está silenciado.
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

router.post('/mod/users/:username/mod', promoteUserToMod)
router.post('/mod/users/:username/mute', muteUser)
router.delete('/mod/users/:username/mod', demoteMod)
