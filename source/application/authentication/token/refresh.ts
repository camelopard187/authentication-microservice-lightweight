import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { promisify } from 'node:util'
import { BadRequest } from 'http-errors'
import type { VerifyOptions, Secret, JsonWebTokenError } from 'jsonwebtoken'

import { env } from '~/common/environment'
import { InvalidCredentialError } from '~/application/authentication/credential/login'
import { issueAccessToken } from '~/application/common/authentication/authenticate'
import { selectCredential } from '~/periphery/persistence/repository/credential'
import type {
  JsonWebToken,
  Payload
} from '~/application/common/authentication/authenticate'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

export class JsonWebTokenValidateError extends BadRequest {
  readonly name = 'JsonWebTokenValidateError'
}

export const refreshTokenPayload = z.object({ sub: z.string().cuid() })

export type RefreshTokenPayload = z.infer<typeof refreshTokenPayload>

export const verify = promisify<
  JsonWebToken,
  Secret,
  VerifyOptions | undefined,
  Payload
>(jwt.verify)

export const validate =
  <A extends z.ZodRawShape>(schema: z.ZodObject<A>) =>
  (token: JsonWebToken, options?: VerifyOptions) =>
    verify(token, env.PRIVATE_KEY, options)
      .then(decoded => schema.parseAsync(decoded))
      .catch(({ message }: JsonWebTokenError) => {
        throw new JsonWebTokenValidateError(message)
      })

export const validateRefreshToken = validate(refreshTokenPayload)

export const refresh = async (token: RefreshToken): Promise<AccessToken> => {
  const { sub } = await validateRefreshToken(token, {
    algorithms: ['RS256'],
    complete: false
  })

  const entity = await selectCredential({ id: sub })

  if (!entity)
    throw new InvalidCredentialError(
      'Credentials not found for the provided token'
    )

  return await issueAccessToken(entity)
}
