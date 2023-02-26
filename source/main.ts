import config from 'config'

import { logger } from './common/logger'
import { application } from './periphery/presentation/application'

const port = config.get('http.port')

application
  .listen(port, () => logger.info(`Server listening on port ${port}`))
  .on('error', ({ message, cause }) => logger.error(message, { cause }))
