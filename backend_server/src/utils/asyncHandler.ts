import { Request, Response, NextFunction } from 'express'

/* ✅ Async handler using promises */

/**
 * Wraps an asynchronous route handler or middleware function for express, automatically catching any
 * thrown errors and passing them to the next error handling middleware in the stack.
 *
 * @param {Function} requestHandler - The asynchronous route handler or middleware function to be wrapped.
 * This function should take Express's `req`, `res`, and `next` parameters.
 *
 * @returns {Function} A function that takes Express's `req`, `res`, and `next` parameters. When called,
 * it executes the original `requestHandler`, and if any errors are thrown or rejected promises are returned,
 * it catches those errors and passes them to the next error handling middleware using `next(error)`.
 */

const asyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => void
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error)
    })
  }
}

export { asyncHandler }

/* ✅ Async handler using try-catch and async-await  */

// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(error?.code || 500).json({
//         success: false,
//         message: error?.message,
//       });
//     }
//   };
// };
