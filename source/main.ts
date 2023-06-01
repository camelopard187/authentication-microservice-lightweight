import { logger } from '~/common/logger'
import { env } from '~/common/environment'
import { application } from '~/periphery/presentation/application'

const port = env.PORT || 3000

application
  .listen(port, () => logger.info(`Server listening on port ${port}`))
  .on('error', ({ message, cause }) => logger.error(message, { cause }))
