import { ErrorName } from '@/utils/errorHandling/types'

interface IApiSubError {
  name: string
  code: string
  message: string
}

export interface IBaseError {
  readonly statusCode: number
  readonly data: null
  readonly error: { name: ErrorName; message: string }
  readonly isOperationalError: boolean
  readonly success: boolean
  readonly errors: IApiSubError[]
}

class BaseError extends Error implements IBaseError {
  readonly statusCode: number
  readonly data: null
  readonly error: { name: ErrorName; message: string }
  readonly isOperationalError: boolean
  readonly success: boolean
  readonly errors: IApiSubError[]

  constructor({
    statusCode = 500,
    name = ErrorName.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    isOperationalError = false,
    errors = [],
    stack = '',
  }) {
    super(message)

    this.statusCode = statusCode
    this.data = null
    this.error = { name, message }
    this.success = false
    this.isOperationalError = isOperationalError
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { BaseError }
