import compression from 'compression'
import express from 'express'
import morgan from 'morgan'

import { stream } from '../../common/logger'
import { controller } from './authentication/controller'
import { errorHandler } from './common/error-handler'

export const application = express()
  .use(express.json(), compression(), morgan('combined', { stream }))
  .use('/v1', controller({ strict: true }))
  .use(errorHandler)
