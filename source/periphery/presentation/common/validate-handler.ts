import type { ZodObject, ZodRawShape } from 'zod'
import type { RequestHandler } from 'express'

import { object } from './error-handler'

export const validate =
  <A extends ZodRawShape>(schema: ZodObject<A>): RequestHandler =>
  (request, response, next) =>
    schema
      .parseAsync(request.body)
      .then(body => ((request.body = body), next()))
      .catch((error: Error) => response.status(400).json(object(error)))
