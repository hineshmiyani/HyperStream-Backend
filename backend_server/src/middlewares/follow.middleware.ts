import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'

import { prisma } from '@/db/prisma'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { followSchema } from '@/validators/follow.schema'

const getIsUserAlreadyFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const isAlreadyFollowing = await prisma.follow.findFirst({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    })

    return isAlreadyFollowing ? true : false
  } catch (error) {
    throw ApiError.Api500Error({ message: 'Something went wrong!' })
  }
}

const validateFollowUserData = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const followingId = req.body?.followingId || req.params.followingId

    const payload = followSchema.safeParse({ followingId })

    if (!payload?.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({ message: errorMessage })
    }

    if ('followingId' in req.body) {
      req.body = payload?.data
    } else if ('followingId' in req.params) {
      req.params = payload?.data
    }

    next()
  }
)

const validateIsUserNotFollowing = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { followingId } = req.body

    const userId = (req.user as User)?.id

    if (followingId === userId) {
      throw ApiError.Api400Error({ message: 'You cannot follow yourself.' })
    }

    const followingUser = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    })

    if (!followingUser) {
      throw ApiError.Api404Error({ message: 'The user you are trying to follow does not exist.' })
    }

    const isUserAlreadyFollowing = await getIsUserAlreadyFollowing(userId, followingId)

    if (isUserAlreadyFollowing) {
      throw ApiError.Api409Error({ message: 'User is already following.' })
    }

    next()
  }
)

const validateIsUserFollowing = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { followingId } = req.body

    const userId = (req.user as User)?.id

    if (followingId === userId) {
      throw ApiError.Api400Error({ message: 'You cannot unfollow yourself.' })
    }

    const followingUser = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    })

    if (!followingUser) {
      throw ApiError.Api404Error({ message: 'The user you are trying to unfollow does not exist.' })
    }

    const isUserAlreadyFollowing = await getIsUserAlreadyFollowing(userId, followingId)

    if (!isUserAlreadyFollowing) {
      throw ApiError.Api409Error({ message: 'User is not following.' })
    }

    next()
  }
)

export {
  getIsUserAlreadyFollowing,
  validateFollowUserData,
  validateIsUserFollowing,
  validateIsUserNotFollowing,
}
