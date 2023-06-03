import { BadRequest } from 'http-errors'
import type { RequestHandler } from 'express'
import type { z } from 'zod'

export class BodyValidationError extends BadRequest {
  readonly name = 'BodyValidationError'
}

export const validate =
  <A extends z.ZodRawShape>(schema: z.ZodObject<A>): RequestHandler =>
  async (request, response, next) => {
    request.body = await schema
      .parseAsync(request.body)
      .catch(({ message }: z.ZodError) => {
        next(new BodyValidationError(message))
      })
    next()
  }
