import { HttpStatusCodes } from '@/constants/httpStatusCodes'

class ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success: boolean

  constructor({
    statusCode = HttpStatusCodes.OK,
    data,
    message = 'Success',
    success = statusCode < 400,
  }: {
    statusCode?: number
    data: T
    message?: string
    success?: boolean
  }) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = success
  }
}

export { ApiResponse }
