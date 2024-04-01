import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import ENV from '@/env'
import { errorHandler } from '@/middlewares/errorHandler'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { userSchema } from '@/validators/user.schema'

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

// temporary route to test utils
app.post(
  '/signup',
  asyncHandler((req: Request, res: Response) => {
    const { name, email } = req.body

    const payload = userSchema.safeParse({ name, email })

    if (!payload?.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({
        message: errorMessage,
      })
    }

    return res.status(HttpStatusCodes.OK).json(
      new ApiResponse({
        data: payload?.data,
        message: 'User created successfully.',
      })
    )
  })
)

app.use(errorHandler)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port listening on port ${PORT}!`)
})
