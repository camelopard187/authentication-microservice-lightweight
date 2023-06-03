import type { Request, Response, NextFunction } from 'express'
import { HttpError, InternalServerError } from 'http-errors'

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const { name, message, statusCode } =
    error instanceof HttpError
      ? error
      : new InternalServerError('Something went wrong')

  response.status(statusCode).json({ name, message })
}
