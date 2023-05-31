import { BadRequest } from 'http-errors'
import type { ZodObject, ZodRawShape } from 'zod'
import type { RequestHandler } from 'express'

export class BodyValidationError extends BadRequest {
  readonly name = 'BodyValidationError'
}

export const validate =
  <A extends ZodRawShape>(schema: ZodObject<A>): RequestHandler =>
  async (request, response, next) => {
    request.body = await schema
      .parseAsync(request.body)
      .catch(({ message }: z.ZodError) => {
        next(new BodyValidationError(message))
      })
    next()
  }
