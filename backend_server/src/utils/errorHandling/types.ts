enum ErrorName {
  // Client Errors (4xx)
  BAD_REQUEST = 'BadRequestError', // 400 Bad Request
  UNAUTHORIZED = 'UnauthorizedError', // 401 Unauthorized
  FORBIDDEN = 'ForbiddenError', // 403 Forbidden
  NOT_FOUND = 'NotFoundError', // 404 Not Found
  METHOD_NOT_ALLOWED = 'MethodNotAllowedError', // 405 Method Not Allowed
  CONFLICT = 'ConflictError', // 409 Conflict
  UNPROCESSABLE_ENTITY = 'UnprocessableEntityError', // 422 Unprocessable Entity

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'InternalServerError', // 500 Internal Server Error
  NOT_IMPLEMENTED = 'NotImplementedError', // 501 Not Implemented
  BAD_GATEWAY = 'BadGatewayError', // 502 Bad Gateway
  SERVICE_UNAVAILABLE = 'ServiceUnavailableError', // 503 Service Unavailable
  GATEWAY_TIMEOUT = 'GatewayTimeoutError', // 504 Gateway Timeout
}

export { ErrorName }
