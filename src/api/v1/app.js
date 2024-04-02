import express from 'express'
import cors from 'cors'
import { logger } from 'logger-express'
// import swagger from './config/swagger/swagger.js'
import { corsOptions } from '../../config/index.js'
import userRouter from '../v1/routes/usuarioRouter.js'
import authRouter from '../v1/routes/authRouter.js'
import { errorHandler, notFoundHandler } from './middleware/index.js'

const app = express()

app.use(cors(corsOptions))

// swagger(app)
app.use(logger())
app.use(express.json())
app.use('/api/v1/usuarios', userRouter)
app.use('/api/v1/auth', authRouter)

app.use('*', notFoundHandler)
app.use(errorHandler)

export default app
