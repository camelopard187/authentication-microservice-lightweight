import ms from 'ms'
import type { RequestHandler } from 'express'

import { login } from '../../../../application/authentication/credential/login'

const cookieOptions = { httpOnly: true, maxAge: ms('30d') }

export const loginHandler: RequestHandler = (request, response, next) =>
  login(request.body)
    .then(details =>
      response
        .cookie('refresh-token', details.tokens.refresh, cookieOptions)
        .json(details)
    )
    .catch(error => next(error))
