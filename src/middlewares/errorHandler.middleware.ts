import { NextFunction, Request, Response } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { BaseError, IBaseError } from '@/utils/errorHandling/BaseError'
import { ErrorName } from '@/utils/errorHandling/types'

/**
 * Middleware function to handle errors.
 *
 * @param error - The error object.
 * @param _req - The request object.
 * @param res - The response object.
 * @param _next - The next function.
 * @returns void
 */

const errorHandler = (
  error: IBaseError | Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = (error as IBaseError)?.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR
  const isBaseError = error instanceof BaseError

  if (isBaseError) {
    res.status(statusCode).json(error)
    return
  }

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: statusCode,
    error: {
      name: ErrorName.INTERNAL_SERVER_ERROR,
      message: (error as Error)?.message || 'Internal server error',
    },
    success: false,
    ...(process.env.NODE_ENV?.includes('dev') ? { stack: (error as Error)?.stack } : {}),
    isOperationalError: false,
  })
}

export { errorHandler }
