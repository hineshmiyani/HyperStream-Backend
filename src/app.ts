import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response, Express } from 'express'

import ENV from '@/env'
import { passport, verifyJWT } from '@/middlewares/auth.middleware'
import { errorHandler } from '@/middlewares/errorHandler.middleware'
import userRouter from '@/routes/user.routes'
import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { ApiResponse } from '@/utils/ApiResponse'

dotenv.config({
  path: './.env',
})

const PORT = ENV.PORT

const app: Express = express()

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(passport.initialize())

app.use('/api/v1/users', userRouter)

app.get('/api/v1/protected', verifyJWT, (_req: Request, res: Response) => {
  res.status(HttpStatusCodes.OK).json(new ApiResponse({ message: 'This is a protected route' }))
})

app.use(errorHandler)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port listening on port ${PORT}!`)
})
