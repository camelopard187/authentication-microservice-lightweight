import { createLogger, transports } from 'winston'
import type { StreamOptions } from 'morgan'

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs.log' })
  ]
})

export const stream: StreamOptions = { write: message => logger.http(message) }
