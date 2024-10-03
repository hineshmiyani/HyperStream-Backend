import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'

import { prisma } from '@/db/prisma'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { blockSchema } from '@/validators/block.schema'

const getIsBlockedByUser = async (currentUserId: string, otherUserId: string): Promise<boolean> => {
  try {
    const isUserBlocked = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: currentUserId,
          blockedId: otherUserId,
        },
      },
    })

    return isUserBlocked ? true : false
  } catch (error) {
    throw ApiError.Api500Error({ message: 'Something went wrong!' })
  }
}

const validateBlockUserData = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.body?.userId || req.params?.userId
    const otherUserId = req.body?.otherUserId || req.params?.otherUserId

    const payload = blockSchema.safeParse({ userId, otherUserId })

    if (!payload?.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({ message: errorMessage })
    }

    if ('otherUserId' in req.body) {
      req.body = payload?.data
    } else if ('otherUserId' in req.params) {
      req.params = payload?.data
    }

    next()
  }
)

const validateIsUserNotAlreadyBlocked = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { otherUserId } = req.body

    const currentUserId = (req.user as User)?.id

    if (otherUserId === currentUserId) {
      throw ApiError.Api400Error({
        message: 'You cannot block yourself.',
      })
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
    })

    if (!otherUser) {
      throw ApiError.Api404Error({ message: 'The user you are trying to block does not exist.' })
    }

    const isUserAlreadyBlocked = await getIsBlockedByUser(currentUserId, otherUserId)

    if (isUserAlreadyBlocked) {
      throw ApiError.Api409Error({ message: 'User is already blocked.' })
    }

    next()
  }
)

const validateIsUserAlreadyBlocked = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { otherUserId } = req.body

    const currentUserId = (req.user as User)?.id

    if (otherUserId === currentUserId) {
      throw ApiError.Api400Error({
        message: 'You cannot unblock yourself.',
      })
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
    })

    if (!otherUser) {
      throw ApiError.Api404Error({ message: 'The user you are trying to unblock does not exist.' })
    }

    const isUserAlreadyBlocked = await getIsBlockedByUser(currentUserId, otherUserId)

    if (!isUserAlreadyBlocked) {
      throw ApiError.Api409Error({ message: 'User is not blocked.' })
    }

    next()
  }
)

export {
  getIsBlockedByUser,
  validateBlockUserData,
  validateIsUserAlreadyBlocked,
  validateIsUserNotAlreadyBlocked,
}
