import express from 'express'
import cors from 'cors'
import { logger } from 'logger-express'
import swagger from '../../config/swagger.js'
import { corsOptions } from '../../config/index.js'
import userRouter from './routes/userRouter.js'
import authRouter from '../v1/routes/authRouter.js'
import categoryRouter from '../v1/routes/categoryRouter.js'
import searchRouter from './routes/searchRouter.js'
import postRouter from '../v1/routes/postRouter.js'
import commentRouter from '../v1/routes/commentRouter.js'
import reportRouter from '../v1/routes/reportRouter.js'
import modRouter from '../v1/routes/modRouter.js'
import { errorHandler, notFoundHandler } from './middleware/index.js'

const app = express()

app.use(cors(corsOptions))

swagger(app)
app.use(logger())
app.use(express.json())
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/posts/:postId/comments', commentRouter)
app.use('/api/v1/reports', reportRouter)
app.use('/api/v1/mod', modRouter)

app.use('*', notFoundHandler)
app.use(errorHandler)

export default app
