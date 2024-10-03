import { User } from '@prisma/client'
import { Request, Response } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { prisma } from '@/db/prisma'
import { getIsBlockedByUser } from '@/middlewares/block.middleware'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { excludeKeys } from '@/utils/utilityFunctions/excludeKeys'

const isUserBlocked = asyncHandler(async (req: Request, res: Response) => {
  const { userId, otherUserId } = req.params || {}

  const isUserBlocked = await getIsBlockedByUser(userId, otherUserId)

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: { isUserBlocked },
      message: `User is ${isUserBlocked ? 'blocked' : 'not blocked'}.`,
    })
  )
})

const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { otherUserId } = req.body

  const userId = (req.user as User)?.id

  const blockedUser = await prisma.block.create({
    data: {
      blockerId: userId,
      blockedId: otherUserId,
    },
    include: {
      blocked: true,
    },
  })

  if (!blockedUser) {
    throw ApiError.Api500Error({ message: 'Something went wrong!' })
  }

  const sanitizedBlockedUser = {
    ...blockedUser,
    blocked: excludeKeys(blockedUser?.blocked, ['password', 'refreshToken']),
  }

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: sanitizedBlockedUser,
      message: `You have blocked ${sanitizedBlockedUser?.blocked?.username}.`,
    })
  )
})

const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const { otherUserId } = req.body

  const userId = (req.user as User)?.id

  const unblockedUser = await prisma.block.delete({
    where: {
      blockerId_blockedId: {
        blockerId: userId,
        blockedId: otherUserId,
      },
    },
    include: {
      blocked: true,
    },
  })

  if (!unblockedUser) {
    throw ApiError.Api500Error({ message: 'Something went wrong!' })
  }

  const sanitizedUnblockedUser = {
    ...unblockedUser,
    blocked: excludeKeys(unblockedUser?.blocked, ['password', 'refreshToken']),
  }

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: sanitizedUnblockedUser,
      message: `You have unblocked ${sanitizedUnblockedUser?.blocked?.username}.`,
    })
  )
})

export { blockUser, isUserBlocked, unblockUser }
