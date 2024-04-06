import express from 'express'
import cors from 'cors'
import { logger } from 'logger-express'
import swagger from '../../config/swagger.js'
import { corsOptions } from '../../config/index.js'
import userRouter from '../v1/routes/usuarioRouter.js'
import authRouter from '../v1/routes/authRouter.js'
import categoryRouter from '../v1/routes/categoryRouter.js'
import miscRouter from '../v1/routes/miscRouter.js'
import postRouter from '../v1/routes/postRouter.js'
import commentRouter from '../v1/routes/commentRouter.js'
import { errorHandler, notFoundHandler } from './middleware/index.js'

const app = express()

app.use(cors(corsOptions))

swagger(app)
app.use(logger())
app.use(express.json())
app.use('/api/v1/usuarios', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/search', miscRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/posts/:postId/comments', commentRouter)

app.use('*', notFoundHandler)
app.use(errorHandler)

export default app
