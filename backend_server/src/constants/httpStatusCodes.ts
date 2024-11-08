class HttpStatusCodes {
  // Informational status codes
  static readonly CONTINUE = 100 // Indicates that the initial part of a request has been received and has not yet been rejected.
  static readonly SWITCHING_PROTOCOLS = 101 // Indicates that the protocol version or protocol is being changed.
  static readonly PROCESSING = 102 // Indicates that the server has received and is processing the request, but no response is available yet.

  // Successful status codes
  static readonly OK = 200 // Indicates that the request has succeeded.
  static readonly CREATED = 201 // Indicates that a new resource has been created.
  static readonly ACCEPTED = 202 // Indicates that the request has been accepted for processing, but the processing has not been completed.
  static readonly NON_AUTHORITATIVE_INFORMATION = 203 // Indicates that the metadata returned is not exactly the same as is available from the origin server.
  static readonly NO_CONTENT = 204 // Indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
  static readonly RESET_CONTENT = 205 // Indicates that the client should reset the document view which caused the request to be sent.
  static readonly PARTIAL_CONTENT = 206 // Indicates that the server is delivering only part of the resource due to a range header sent by the client.
  static readonly MULTI_STATUS = 207 // Provides status for multiple independent operations.
  static readonly ALREADY_REPORTED = 208 // Indicates that the members of a DAV binding have already been enumerated in a previous response.
  static readonly IM_USED = 226 // Indicates that the server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.

  // Redirection status codes
  static readonly MULTIPLE_CHOICES = 300 // Indicates that the requested resource corresponds to any one of a set of representations.
  static readonly MOVED_PERMANENTLY = 301 // Indicates that the requested resource has been moved permanently to a new URI.
  static readonly FOUND = 302 // Indicates that the requested resource resides temporarily under a different URI.
  static readonly SEE_OTHER = 303 // Indicates that the response to the request can be found under a different URI.
  static readonly NOT_MODIFIED = 304 // Indicates that the resource has not been modified since the version specified by the request headers.
  static readonly USE_PROXY = 305 // Indicates that the requested resource must be accessed through the proxy given by the Location field.
  static readonly TEMPORARY_REDIRECT = 307 // Indicates that the requested resource resides temporarily under a different URI.
  static readonly PERMANENT_REDIRECT = 308 // Indicates that the requested resource has been permanently moved to a new URI.

  // Client error status codes
  static readonly BAD_REQUEST = 400 // Indicates that the server cannot or will not process the request due to something that is perceived to be a client error.
  static readonly UNAUTHORIZED = 401 // Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
  static readonly PAYMENT_REQUIRED = 402 // Indicates that payment is required to access the requested resource.
  static readonly FORBIDDEN = 403 // Indicates that the server understood the request but refuses to authorize it.
  static readonly NOT_FOUND = 404 // Indicates that the requested resource could not be found but may be available again in the future.
  static readonly METHOD_NOT_ALLOWED = 405 // Indicates that the request method is known by the server but is not supported by the target resource.
  static readonly NOT_ACCEPTABLE = 406 // Indicates that the requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
  static readonly PROXY_AUTHENTICATION_REQUIRED = 407 // Indicates that the client must first authenticate itself with the proxy.
  static readonly REQUEST_TIMEOUT = 408 // Indicates that the server timed out waiting for the request.
  static readonly CONFLICT = 409 // Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.
  static readonly GONE = 410 // Indicates that the requested resource is no longer available at the server and no forwarding address is known.
  static readonly LENGTH_REQUIRED = 411 // Indicates that the server refuses to accept the request without a defined Content-Length header.
  static readonly PRECONDITION_FAILED = 412 // Indicates that one or more conditions given in the request header fields evaluated to false when tested on the server.
  static readonly PAYLOAD_TOO_LARGE = 413 // Indicates that the request entity is larger than limits defined by server.
  static readonly URI_TOO_LONG = 414 // Indicates that the URI requested by the client is longer than the server is willing to interpret.
  static readonly UNSUPPORTED_MEDIA_TYPE = 415 // Indicates that the media format of the requested data is not supported by the server, so the server is rejecting the request.
  static readonly RANGE_NOT_SATISFIABLE = 416 // Indicates that the range of data requested from the resource cannot be returned, either because the start is before the end of the resource, or because the byte range requested is not defined.
  static readonly EXPECTATION_FAILED = 417 // Indicates that the expectation given in the request's Expect header could not be met.
  static readonly IM_A_TEAPOT = 418 // This HTTP status is used as an Easter egg in some websites, including Google.com.
  static readonly MISDIRECTED_REQUEST = 421 // Indicates that the request was directed at a server that is not able to produce the requested response.
  static readonly UNPROCESSABLE_ENTITY = 422 // Indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
  static readonly LOCKED = 423 // Indicates that the resource that is being accessed is locked.
  static readonly FAILED_DEPENDENCY = 424 // Indicates that the request failed due to failure of a previous request.
  static readonly UPGRADE_REQUIRED = 426 // Indicates that the client should switch to a different protocol.
  static readonly PRECONDITION_REQUIRED = 428 // Indicates that the origin server requires the request to be conditional.
  static readonly TOO_MANY_REQUESTS = 429 // Indicates that the user has sent too many requests in a given amount of time ("rate limiting").
  static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = 431 // Indicates that the server is unwilling to process the request because its header fields are too large.
  static readonly UNAVAILABLE_FOR_LEGAL_REASONS = 451 // Indicates that the server is denying access to the resource as a consequence of a legal demand.

  // Server error status codes
  static readonly INTERNAL_SERVER_ERROR = 500 // Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  static readonly NOT_IMPLEMENTED = 501 // Indicates that the server does not support the functionality required to fulfill the request.
  static readonly BAD_GATEWAY = 502 // Indicates that the server received an invalid response from an upstream server.
  static readonly SERVICE_UNAVAILABLE = 503 // Indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance.
  static readonly GATEWAY_TIMEOUT = 504 // Indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.
  static readonly HTTP_VERSION_NOT_SUPPORTED = 505 // Indicates that the server does not support the HTTP protocol version used in the request.
  static readonly VARIANT_ALSO_NEGOTIATES = 506 // Indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
  static readonly INSUFFICIENT_STORAGE = 507 // Indicates that the server is unable to store the representation needed to complete the request.
  static readonly LOOP_DETECTED = 508 // Indicates that the server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity".
  static readonly NOT_EXTENDED = 510 // Indicates that further extensions to the request are required for the server to fulfill it.
  static readonly NETWORK_AUTHENTICATION_REQUIRED = 511 // Indicates that the client needs to authenticate to gain network access.
}

export { HttpStatusCodes }
