import { Router } from 'express'
import type { RouterOptions } from 'express'

import { registerHandler } from '~/periphery/presentation/authentication/credential/register-handler'
import { loginHandler } from '~/periphery/presentation/authentication/credential/login-handler'
import { refreshHandler } from '~/periphery/presentation/authentication/token/refresh-handler'
import { validate } from '~/periphery/presentation/common/validate-handler'
import { credential } from '~/domain/authentication/credential/model'
import { candidate } from '~/application/authentication/credential/login'

export const controller = (options?: RouterOptions) =>
  Router(options)
    .post('/register', validate(credential), registerHandler)
    .post('/login', validate(candidate), loginHandler)
    .post('/refresh', refreshHandler)
