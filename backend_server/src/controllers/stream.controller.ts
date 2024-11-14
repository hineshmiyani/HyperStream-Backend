import { User } from '@prisma/client'
import { Request, Response } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { prisma } from '@/db/prisma'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'

const getStreamByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params

  const stream = await prisma.stream.findUnique({
    where: {
      userId: userId,
    },
  })

  if (!stream) {
    throw ApiError.Api404Error({
      message: 'Stream not found.',
    })
  }

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: stream,
      message: `Stream fetched successfully for user with id: ${userId}`,
    })
  )
})

const updateStream = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id

  const data = req.body

  const stream = await prisma.stream.findUnique({
    where: {
      userId: userId,
    },
  })

  if (!stream) {
    throw ApiError.Api404Error({ message: 'Stream not found.' })
  }

  const updatedStream = await prisma.stream.update({
    where: {
      id: stream?.id,
    },
    data: {
      name: data?.name,
      isChatEnabled: data?.isChatEnabled,
      isChatFollowersOnly: data?.isChatFollowersOnly,
      isChatDelayed: data?.isChatDelayed,
    },
  })

  return res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ data: updatedStream, message: 'Stream updated successfully.' }))
})

const verifyStreamSecret = asyncHandler(async (req: Request, res: Response) => {
  const streamKey = req.body.key

  if (streamKey === 'supersecret') {
    return res.status(HttpStatusCodes.OK).json(new ApiResponse({ message: 'Stream key is valid.' }))
  } else {
    res.status(HttpStatusCodes.FORBIDDEN).json('stream key is invalid')
    return ApiError.Api403Error({
      message: 'Stream key is invalid.',
    })
  }
})

export { getStreamByUserId, updateStream, verifyStreamSecret }
