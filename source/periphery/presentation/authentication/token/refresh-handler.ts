import type { RequestHandler } from 'express'

import { refresh } from '../../../../application/authentication/token/refresh'

export const refreshHandler: RequestHandler = (request, response, next) =>
  refresh(request.cookies['refresh-token'])
    .then(access => response.json({ access }))
    .catch(error => next(error))
