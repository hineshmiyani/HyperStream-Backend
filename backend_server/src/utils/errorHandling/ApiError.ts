import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { BaseError } from '@/utils/errorHandling/BaseError'
import { ErrorName } from '@/utils/errorHandling/types'

class ApiError {
  static Api400Error({
    name = ErrorName.BAD_REQUEST,
    statusCode = HttpStatusCodes.BAD_REQUEST,
    message = 'Bad request',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }

  static Api401Error({
    name = ErrorName.UNAUTHORIZED,
    statusCode = HttpStatusCodes.UNAUTHORIZED,
    message = 'Unauthorized: You need to be authenticated to perform this request',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }

  static Api404Error({
    name = ErrorName.NOT_FOUND,
    statusCode = HttpStatusCodes.NOT_FOUND,
    message = 'Requested data is not found',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }

  static Api409Error({
    name = ErrorName.CONFLICT,
    statusCode = HttpStatusCodes.CONFLICT,
    message = 'Data already exist',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }

  static Api500Error({
    name = ErrorName.INTERNAL_SERVER_ERROR,
    statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Internal server error',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }

  static idNotFoundError({
    name = ErrorName.NOT_FOUND,
    statusCode = HttpStatusCodes.NOT_FOUND,
    message = 'Id not found',
    isOperationalError = true,
  } = {}): BaseError {
    return new BaseError({
      name,
      statusCode,
      message,
      isOperationalError,
    })
  }
}

export { ApiError }
