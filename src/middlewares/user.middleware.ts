import { NextFunction, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'

import { prisma } from '@/db/prisma'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import {
  baseUserSchema,
  loginUserSchema,
  resetPasswordSchema,
  signUpUserSchema,
} from '@/validators/user.schema'

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

const isUserEmailVerified = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isEmailVerified: true },
    })

    if (!user?.isEmailVerified) {
      throw ApiError.Api401Error({ message: 'Please verify your email first!' })
    }

    next()
  }
)

const validateSignUpUserData = asyncHandler((req: Request, _res: Response, next: NextFunction) => {
  const { username, email, password } = req.body

  const payload = signUpUserSchema.safeParse({ username, email, password })

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message
    throw ApiError.Api400Error({ message: errorMessage })
  }

  req.body = payload?.data

  next()
})

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

const validateUserEmail = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const { email } = req.body

  const payload = baseUserSchema.pick({ email: true }).safeParse({ email })

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message
    throw ApiError.Api400Error({ message: errorMessage })
  }

  req.body = payload?.data

  next()
})

const validateResetPasswordData = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { token, password } = req.body

    const payload = resetPasswordSchema.safeParse({
      token,
      password,
    })

    if (!payload?.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({ message: errorMessage })
    }

    req.body = payload?.data

    next()
  }
)

export {
  isUserEmailVerified,
  isUserExist,
  validateLoginUserData,
  validateResetPasswordData,
  validateSignUpUserData,
  validateUserEmail,
}
