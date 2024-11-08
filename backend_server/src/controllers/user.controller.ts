import { AuthProvider, User } from '@prisma/client'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { prisma } from '@/db/prisma'
import ENV from '@/env'
import {
  generateAccessAndRefreshTokens,
  generateHashedPassword,
  getIsPasswordCorrect,
  sendResetPasswordEmail,
  sendVerificationEmail,
  verifyToken,
} from '@/services/auth.service'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { excludeKeys } from '@/utils/utilityFunctions/excludeKeys'

const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const hashedPassword = await generateHashedPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        authProviders: [AuthProvider.JWT],
        stream: {
          create: {
            name: `${username}'s stream`,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    await sendVerificationEmail(user?.id, user?.email)

    return res.status(HttpStatusCodes.CREATED).json(
      new ApiResponse({
        statusCode: HttpStatusCodes.CREATED,
        data: user,
        message: 'Verification email sent successfully.',
      })
    )
  } catch (error) {
    await prisma.user.delete({
      where: {
        email: req.body?.email,
      },
    })
    throw ApiError.Api500Error()
  }
})

const verifyUserEmail = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  })

  const registeredUser = excludeKeys(updatedUser, ['password', 'refreshToken'])

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      message: 'Email verified successfully.',
      data: registeredUser,
    })
  )
})

const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw ApiError.Api404Error({ message: 'User with the provided email does not exist.' })
    }

    if (user?.isEmailVerified) {
      throw ApiError.Api400Error({ message: 'Email already verified.' })
    }

    await sendVerificationEmail(user?.id, user?.email)

    return res.status(HttpStatusCodes.OK).json(
      new ApiResponse({
        message: 'Verification email sent successfully.',
      })
    )
  } catch (error) {
    throw ApiError.Api500Error()
  }
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
      message: 'User with the provided username or email does not exist.',
    })
  }

  if (!user?.isEmailVerified) {
    throw ApiError.Api401Error({ message: 'Please verify your email first!' })
  }

  const isPasswordCorrect = await getIsPasswordCorrect(password, user?.password || '')

  if (!isPasswordCorrect) {
    throw ApiError.Api400Error({
      message: 'Please enter correct password!',
    })
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?.id)

  const loggedInUser = excludeKeys(user, ['password', 'refreshToken'])

  return res.status(HttpStatusCodes.OK).json(
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

const loginUserWithGoogleOrFacebook = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?.id)

  return res.redirect(
    `${ENV.FRONTEND_BASE_URL}/verify-email?accessToken=${accessToken}&refreshToken=${refreshToken}&socialLogin=true`
  )
})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  })

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ message: 'User logged out successfully.' }))
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: incomingRefreshToken } = req.body

  if (!incomingRefreshToken) {
    throw ApiError.Api401Error({ message: 'Unauthorized request!' })
  }

  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, ENV.REFRESH_TOKEN_SECRET)

    const user = await prisma.user.findUnique({
      where: {
        id: (decodedRefreshToken as Partial<User>)?.id,
      },
    })

    if (!user) {
      throw ApiError.Api401Error({ message: 'Invalid refresh token!' })
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw ApiError.Api401Error({ message: 'Refresh token is expired or used!' })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?.id)

    return res.status(HttpStatusCodes.OK).json(
      new ApiResponse({
        data: { accessToken, refreshToken },
        message: 'Access token refreshed successfully.',
      })
    )
  } catch (error) {
    throw ApiError.Api401Error({ message: 'Invalid refresh token!' })
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const userId = (req.user as User)?.id

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  const isPasswordCorrect = await getIsPasswordCorrect(currentPassword, user?.password || '')

  if (!isPasswordCorrect) {
    throw ApiError.Api400Error({
      message: 'Please enter valid current password!',
    })
  }

  const hashedPassword = await generateHashedPassword(newPassword)

  // update user password
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  })

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ message: 'Password changed successfully.' }))
})

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user || {}

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      message: 'Current user fetched successfully.',
      data: user,
    })
  )
})

const getCurrentUserByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params

  const userId = (req.user as User)?.id

  const currentUser = await prisma.user.findFirst({
    where: {
      username: username,
    },
  })

  if (!currentUser) {
    throw ApiError.Api404Error({
      message: 'User with the provided username does not exist.',
    })
  }

  if (currentUser?.id !== userId) {
    throw ApiError.Api401Error({ message: 'Unauthorized request!' })
  }

  const sanitizedUser = excludeKeys(currentUser, ['password', 'refreshToken'])

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ data: sanitizedUser, message: 'User fetched successfully.' }))
})

const getUserByUsernameOrId = asyncHandler(async (req: Request, res: Response) => {
  const { username, userId } = req.params

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        {
          id: userId,
        },
      ],
    },
  })

  if (!user) {
    throw ApiError.Api404Error({
      message: 'User with the provided username or userId does not exist.',
    })
  }

  const sanitizedUser = excludeKeys(user, ['password', 'refreshToken'])

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ data: sanitizedUser, message: 'User fetched successfully.' }))
})

const getRecommendUsers = asyncHandler(async (req: Request, res: Response) => {
  const { currentUserId } = req.query || {}

  const data = await prisma.user.findMany({
    where: {
      AND: [
        {
          NOT: {
            id: String(currentUserId || ''),
          },
        },
        {
          NOT: {
            followedBy: {
              some: {
                followerId: String(currentUserId || ''),
              },
            },
          },
        },
        {
          NOT: {
            blocking: {
              some: {
                blockedId: String(currentUserId || ''),
              },
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const users = data.map((user) => excludeKeys(user, ['password', 'refreshToken']))

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      message: 'All users fetched successfully.',
      data: users,
    })
  )
})

const sendPasswordRecoveryEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body || {}

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw ApiError.Api404Error({ message: 'User with the provided email does not exist.' })
  }

  await sendResetPasswordEmail(user)

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ message: 'Password recovery email sent successfully.' }))
})

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body

  const decodedUserData = await verifyToken(token)

  if (!decodedUserData) {
    throw ApiError.Api401Error({ message: 'Token is expired or used!' })
  }

  const hashedPassword = await generateHashedPassword(password)

  const updatedUser = await prisma.user.update({
    where: {
      id: (decodedUserData as Partial<User>)?.id,
    },
    data: {
      password: hashedPassword,
    },
  })

  if (!updatedUser) {
    throw ApiError.Api401Error({ message: 'Invalid token!' })
  }

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ message: 'Password reset successfully.' }))
})

const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body

  const userId = (req.user as User)?.id

  const user = await prisma.user.update({
    where: { id: userId },
    data: body,
  })

  const updatedUser = excludeKeys(user, ['password', 'refreshToken'])

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ data: updatedUser, message: 'User details updated successfully.' }))
})

export {
  changeCurrentPassword,
  getCurrentUser,
  getCurrentUserByUsername,
  getRecommendUsers,
  getUserByUsernameOrId,
  loginUser,
  loginUserWithGoogleOrFacebook,
  logoutUser,
  refreshAccessToken,
  resendVerificationEmail,
  resetPassword,
  sendPasswordRecoveryEmail,
  signUpUser,
  updateAccountDetails,
  verifyUserEmail,
}
