import { Router } from 'express'
import type { RouterOptions } from 'express'

import { registerHandler } from './credential/register-handler'

export const controller = (options?: RouterOptions) => Router(options).post('/register', registerHandler)
