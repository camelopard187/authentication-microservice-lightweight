import cookieParser from 'cookie-parser'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'

import { stream } from '~/common/logger'
import { controller } from '~/periphery/presentation/authentication/controller'
import { errorHandler } from '~/periphery/presentation/common/error-handler'

export const application = express()
  .use(
    express.json(),
    cookieParser(),
    compression(),
    morgan('combined', { stream })
  )
  .use('/v1', controller({ strict: true }))
  .use(errorHandler)
