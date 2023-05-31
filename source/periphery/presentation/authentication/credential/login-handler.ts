import ms from 'ms'
import type { Request, Response, NextFunction } from 'express'

import { login } from '../../../../application/authentication/credential/login'
import type { Candidate } from '../../../../application/authentication/credential/login'
import type { AuthenticationDetails } from '../../../../application/common/authentication/authenticate'

const cookieOptions = { httpOnly: true, maxAge: ms('30d') }

export const loginHandler = (
  request: Request<unknown, unknown, Candidate>,
  response: Response<AuthenticationDetails>,
  next: NextFunction
): void => {
  login(request.body)
    .then(details =>
      response
        .cookie('refresh-token', details.tokens.refresh, cookieOptions)
        .json(details)
    )
    .catch(error => next(error))
}
