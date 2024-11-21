import { User } from '@prisma/client'
import { Request, Response } from 'express'
import { nanoid } from 'nanoid'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { prisma } from '@/db/prisma'
import ENV from '@/env'
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
    throw ApiError.Api404Error({
      message: 'Stream not found.',
    })
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

const generateStreamConnection = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id

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

  const serverUrl = ENV.RTMP_SERVER_URL

  // eslint-disable-next-line quotes
  const streamName = `${stream?.name?.split("'")?.[0]}_${nanoid(10)}`
  const streamKey = `${streamName}?key=${nanoid()}`

  const updatedStream = await prisma.stream.update({
    where: {
      id: stream?.id,
    },
    data: {
      streamKey: streamKey,
      serverUrl: serverUrl,
    },
  })

  return res.status(HttpStatusCodes.OK).json(
    new ApiResponse({
      data: updatedStream,
      message: 'Stream connection generated successfully.',
    })
  )
})

const onStreamStart = asyncHandler(async (req: Request, res: Response) => {
  const { name: streamName, streamKey } = req.body

  const stream = await prisma.stream.findFirst({
    where: {
      streamKey: `${streamName}?key=${streamKey}`,
    },
  })

  if (stream && stream?.streamKey) {
    await prisma.stream.update({
      where: {
        id: stream?.id,
      },
      data: {
        isLive: true,
      },
    })

    return res.status(HttpStatusCodes.OK).json(new ApiResponse({ message: 'Stream key is valid.' }))
  } else {
    console.error('Error: Stream key is invalid.')

    throw ApiError.Api403Error({
      message: 'Stream key is invalid.',
    })
  }
})

const onStreamEnd = asyncHandler(async (req: Request, res: Response) => {
  const { name: streamName, streamKey } = req.body

  const stream = await prisma.stream.findFirst({
    where: {
      streamKey: `${streamName}?key=${streamKey}` || '',
    },
  })

  if (stream && stream?.streamKey) {
    await prisma.stream.update({
      where: {
        id: stream?.id,
      },
      data: {
        isLive: false,
      },
    })

    return res
      .status(HttpStatusCodes.OK)
      .json(new ApiResponse({ message: 'Stream ended successfully.' }))
  } else {
    console.error('Error: Stream cannot end because the stream key is invalid.')

    throw ApiError.Api403Error({
      message: 'Stream cannot end because the stream key is invalid.',
    })
  }
})

export { generateStreamConnection, getStreamByUserId, onStreamEnd, onStreamStart, updateStream }
