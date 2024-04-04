import { NextFunction, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'
import { PrismaClient } from '@prisma/client'

import { asyncHandler } from '@/utils/asyncHandler'
import { loginUserSchema, registerUserSchema } from '@/validators/user.schema'
import { ApiError } from '@/utils/errorHandling/ApiError'

const prisma = new PrismaClient()

const isUserExist = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const { username, email } = req.body

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  })

  if (existingUser) {
    throw ApiError.Api409Error({ message: 'User with email and username already exists!' })
  }

  next()
})

const validateRegisterUserData = asyncHandler(
  (req: Request, _res: Response, next: NextFunction) => {
    const { username, email, password } = req.body

    const payload = registerUserSchema.safeParse({ username, email, password })

    if (!payload?.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({ message: errorMessage })
    }

    req.body = payload?.data

    next()
  }
)

const validateLoginUserData = asyncHandler((req: Request, _res: Response, next: NextFunction) => {
  const { username, email, password } = req.body

  const payload = loginUserSchema.safeParse({ username, email, password })

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message
    throw ApiError.Api400Error({ message: errorMessage })
  }

  req.body = payload?.data

  next()
})

export { isUserExist, validateRegisterUserData, validateLoginUserData }
