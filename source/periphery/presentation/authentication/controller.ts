import { Router } from 'express'
import type { RouterOptions } from 'express'

import { registerHandler } from './credential/register-handler'
import { loginHandler } from './credential/login-handler'

export const controller = (options?: RouterOptions) =>
  Router(options).post('/register', registerHandler).post('/login', loginHandler)
