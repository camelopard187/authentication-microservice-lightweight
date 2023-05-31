import { Router } from 'express'
import type { RouterOptions } from 'express'

import { registerHandler } from './credential/register-handler'
import { loginHandler } from './credential/login-handler'
import { refreshHandler } from './token/refresh-handler'
import { validate } from '../common/validate-handler'
import { credential } from '../../../domain/authentication/credential/model'
import { candidate } from '../../../application/authentication/credential/login'

export const controller = (options?: RouterOptions) =>
  Router(options)
    .post('/register', validate(credential), registerHandler)
    .post('/login', validate(candidate), loginHandler)
    .post('/refresh', refreshHandler)
