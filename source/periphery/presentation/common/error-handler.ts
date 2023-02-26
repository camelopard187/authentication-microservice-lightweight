import type { ErrorRequestHandler } from 'express'

export const object = (error: Error): Error => ({
  name: error.name,
  message: error.message,
  cause: error.cause ? object(error.cause as Error) : error.cause
})

export const errorHandler: ErrorRequestHandler = (error, request, response, next) =>
  response.status(error.status || 500).json(object(error))
