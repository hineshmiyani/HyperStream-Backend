import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'

import ENV from '@/env'
import { passport } from '@/middlewares/auth.middleware'
import { errorHandler } from '@/middlewares/errorHandler.middleware'
import followRouter from '@/routes/follow.routes'
import uploadRouter from '@/routes/upload.routes'
import userRouter from '@/routes/user.routes'

const app: Express = express()

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(passport.initialize())

// routes declarations
app.use('/api/v1/users', userRouter)
app.use('/api/v1/uploads', uploadRouter)
app.use('/api/v1/follows', followRouter)

// global error handler
app.use(errorHandler)

export { app }
