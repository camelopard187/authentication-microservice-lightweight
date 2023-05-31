import type { Request, Response, NextFunction } from 'express'

import { refresh } from '~/application/authentication/token/refresh'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

declare module 'express' {
  export interface Request {
    cookies: { 'refresh-token': RefreshToken }
  }
}

export const refreshHandler = (
  request: Request,
  response: Response<{ access: AccessToken }>,
  next: NextFunction
): void => {
  refresh(request.cookies['refresh-token'])
    .then(access => response.json({ access }))
    .catch(error => next(error))
}
