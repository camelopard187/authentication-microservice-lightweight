import ms from 'ms'
import type { Request, Response, NextFunction } from 'express'

import { register } from '~/application/authentication/credential/register'
import type { Credential } from '~/domain/authentication/credential/model'
import type { AuthenticationDetails } from '~/application/common/authentication/authenticate'

const cookieOptions = { httpOnly: true, maxAge: ms('30d') }

export const registerHandler = (
  request: Request<unknown, unknown, Credential>,
  response: Response<AuthenticationDetails>,
  next: NextFunction
): void => {
  register(request.body)
    .then(details =>
      response
        .cookie('refresh-token', details.tokens.refresh, cookieOptions)
        .json(details)
    )
    .catch(error => next(error))
}
