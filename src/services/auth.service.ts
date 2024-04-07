import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import ENV from '@/env'
import {
  generateResetPasswordEmail,
  generateVerificationEmail,
  sendEmail,
} from '@/services/nodemailer.service'
import { ApiError } from '@/utils/errorHandling/ApiError'

const prisma = new PrismaClient()

const generateHashedPassword = async (password: string, saltOrRounds = 10): Promise<string> => {
  return await bcrypt.hash(password, saltOrRounds)
}

const getIsPasswordCorrect = async (
  password: string,
  encryptedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, encryptedPassword)
}

const generateAccessToken = async (
  user: User,
  expiresIn = ENV.ACCESS_TOKEN_EXPIRY
): Promise<string> => {
  const { id, email, username } = user

  const payload = { id, email, username }

  const token = await jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn,
  })

  return token
}

const generateRefreshToken = async (
  userId: User['id'],
  expiresIn = ENV.REFRESH_TOKEN_EXPIRY
): Promise<string> => {
  const payload = { id: userId }

  const token = await jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn,
  })

  return token
}

const generateAccessAndRefreshTokens = async (
  userId: User['id']
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await prisma.user
      .findUniqueOrThrow({
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

const verifyToken = async (token: string): Promise<string | jwt.JwtPayload> => {
  return await jwt.verify(token, ENV.ACCESS_TOKEN_SECRET)
}

const sendVerificationEmail = async (userId: string, userEmail: string): Promise<void> => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId)

  const verificationURL = new URL(`${ENV.FRONTEND_BASE_URL}/verify-email`)
  verificationURL.searchParams.set('accessToken', accessToken)
  verificationURL.searchParams.set('refreshToken', refreshToken)

  await sendEmail({
    to: userEmail,
    subject: 'Welcome to HyperStream',
    html: generateVerificationEmail(verificationURL?.toString()),
  })
}

const sendResetPasswordEmail = async (user: User): Promise<void> => {
  const recoveryToken = await generateAccessToken(user)

  const resetPasswordURL = new URL(`${ENV.FRONTEND_BASE_URL}/reset-password`)
  resetPasswordURL.searchParams.set('recoveryToken', recoveryToken)

  await sendEmail({
    to: user.email,
    subject: 'Reset your HyperStream account password',
    html: generateResetPasswordEmail(resetPasswordURL?.toString()),
  })
}

export {
  generateAccessAndRefreshTokens,
  generateAccessToken,
  generateHashedPassword,
  generateRefreshToken,
  getIsPasswordCorrect,
  sendResetPasswordEmail,
  sendVerificationEmail,
  verifyToken,
}
