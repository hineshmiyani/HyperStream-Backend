import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import { asyncHandler } from '@/utils/asyncHandler'
import { ApiResponse } from '@/utils/ApiResponse'
import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { generateAccessAndRefreshTokens } from '@/services/auth.service'
import { COOKIE_OPTIONS } from '@/constants/appConstants'

const prisma = new PrismaClient()

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  })

  return res.status(HttpStatusCodes.CREATED).json(
    new ApiResponse({
      statusCode: HttpStatusCodes.CREATED,
      data: newUser,
      message: 'User created successfully.',
    })
  )
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  })

  if (!user) {
    throw ApiError.Api404Error({
      message: 'User not found',
    })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw ApiError.Api400Error({
      message: 'Please enter correct password.',
    })
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?.id)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password: _password, refreshToken: _refreshToken, ...loggedInUser } = user

  return res
    .status(HttpStatusCodes.OK)
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse({
        statusCode: HttpStatusCodes.OK,
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        message: 'User logged in successfully.',
      })
    )
})

export { registerUser, loginUser }
