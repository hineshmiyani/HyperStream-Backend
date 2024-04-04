import { PrismaClient, User } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { ApiError } from '@/utils/errorHandling/ApiError'
import ENV from '@/env'

const prisma = new PrismaClient()

const generateAccessToken = async (user: User): Promise<string> => {
  const { id, email, username } = user

  const payload = { id, email, username }

  const token = await jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
  })

  return token
}

const generateRefreshToken = async (userId: User['id']): Promise<string> => {
  const payload = { id: userId }

  const token = await jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
  })

  return token
}

const generateAccessAndRefreshTokens = async (
  userId: User['id']
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await prisma.user
      .findFirstOrThrow({
        where: { id: userId },
      })
      .catch(() => {
        throw ApiError.Api404Error({
          message: 'User not found',
        })
      })

    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user.id)

    // update refresh token
    await prisma.user
      .update({
        where: { id: user.id },
        data: { refreshToken },
      })
      .catch(() => {
        throw ApiError.Api500Error({
          message: 'Failed to update user with refresh token',
        })
      })

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw ApiError.Api500Error({
      message: 'Something went wrong while generating refresh and access token!',
    })
  }
}

export { generateAccessToken, generateRefreshToken, generateAccessAndRefreshTokens }
