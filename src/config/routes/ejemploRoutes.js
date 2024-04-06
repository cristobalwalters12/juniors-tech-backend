// fuente: https://github.com/FabianPinoP/swagger-tutorial

import express from 'express'
import { loginUser } from '../../api/v1/controllers/authController'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesion
 *     tags: [Auth]
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
 *             example:
 *               email: jajajajaj@hola.com
 *               password: "Aa1234567"
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

router.post('/auth', loginUser)
