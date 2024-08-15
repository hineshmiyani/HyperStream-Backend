import { User } from '@prisma/client'
import { Request, Response } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { prisma } from '@/db/prisma'
import { getIsUserAlreadyFollowing } from '@/middlewares/follow.middleware'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { excludeKeys } from '@/utils/utilityFunctions/excludeKeys'

const isUserAlreadyFollowing = asyncHandler(async (req: Request, res: Response) => {
  const { followingId } = req.params || {}

  const userId = (req.user as User)?.id

  const isUserAlreadyFollowing = await getIsUserAlreadyFollowing(userId, followingId)

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: { isUserAlreadyFollowing },
      message: `User is ${isUserAlreadyFollowing ? 'following.' : 'not following.'}`,
    })
  )
})

const followUser = asyncHandler(async (req: Request, res: Response) => {
  const { followingId } = req.body

  const userId = (req.user as User)?.id

  const followedUser = await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: followingId,
    },
    include: {
      following: true,
    },
  })

  const sanitizeFollowedUser = {
    ...followedUser,
    following: excludeKeys(followedUser?.following, ['password', 'refreshToken']),
  }

  return res.status(HttpStatusCodes.CREATED).json(
    new ApiResponse({
      statusCode: HttpStatusCodes.CREATED,
      data: sanitizeFollowedUser,
      message: `You are now following ${followedUser?.following?.username}.`,
    })
  )
})

const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const { followingId } = req.body

  const userId = (req.user as User)?.id

  const unfollowedUser = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: followingId,
      },
    },
    include: {
      following: true,
    },
  })

  const sanitizeUnfollowedUser = {
    ...unfollowedUser,
    following: excludeKeys(unfollowedUser?.following, ['password', 'refreshToken']),
  }

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: sanitizeUnfollowedUser,
      message: `You have unfollowed ${unfollowedUser?.following?.username}.`,
    })
  )
})

const getFollowedUsers = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id

  const followedUsers = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  })

  const sanitizedFollowedUsers = followedUsers.map((followedUser) => {
    return {
      ...followedUser,
      following: excludeKeys(followedUser.following, ['password', 'refreshToken']),
    }
  })

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: sanitizedFollowedUsers,
      message: 'Followers have been fetched successfully.',
    })
  )
})

export { followUser, getFollowedUsers, isUserAlreadyFollowing, unfollowUser }
