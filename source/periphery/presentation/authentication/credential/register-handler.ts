import ms from 'ms'
import type { RequestHandler } from 'express'

import { register } from '../../../../application/authentication/credential/register'

const cookieOptions = { httpOnly: true, maxAge: ms('30d') }

export const registerHandler: RequestHandler = (request, response, next) =>
  register(request.body)
    .then(details => response.cookie('refresh-token', details.tokens.refresh, cookieOptions).json(details))
    .catch(error => next(error))
