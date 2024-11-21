import { NextFunction, Request, Response } from 'express'
import { fromZodError } from 'zod-validation-error'

import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'
import { updateStreamSchema, verifyStreamKeySchema } from '@/validators/stream.schema'

const validateUpdateStreamData = asyncHandler(
  (req: Request, _res: Response, next: NextFunction) => {
    const body = req.body

    const payload = updateStreamSchema.partial().safeParse(body)

    if (!payload.success) {
      const errorMessage = fromZodError(payload?.error)?.message
      throw ApiError.Api400Error({
        message: errorMessage,
      })
    }

    req.body = payload?.data

    next()
  }
)

const validateStreamStartData = asyncHandler((req: Request, _res: Response, next: NextFunction) => {
  const { name, key } = req.body || {}

  const payload = verifyStreamKeySchema.safeParse({ name: name, streamKey: key })

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message
    throw ApiError.Api400Error({ message: errorMessage })
  }

  req.body = payload?.data

  next()
})

const validateStreamEndData = asyncHandler((req: Request, _res: Response, next: NextFunction) => {
  const { name, key } = req.body || {}

  const payload = verifyStreamKeySchema.safeParse({ name: name, streamKey: key })

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message
    throw ApiError.Api400Error({ message: errorMessage })
  }

  req.body = payload?.data

  next()
})

export { validateStreamEndData, validateStreamStartData, validateUpdateStreamData }
