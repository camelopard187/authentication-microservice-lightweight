import config from 'config'
import { object, string } from 'zod'
import { readFile } from 'node:fs/promises'
import { verify } from 'jsonwebtoken'
import { promisify } from 'node:util'
import { BadRequest } from 'http-errors'
import type { VerifyOptions, Secret, JsonWebTokenError } from 'jsonwebtoken'
import type { ZodObject, ZodRawShape } from 'zod/lib'

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

export const decode = (
  token: JsonWebToken,
  options: VerifyOptions
): Promise<Payload> =>
  readFile(config.get('key.public.path'), 'utf8').then(secret =>
    promisify<JsonWebToken, Secret, VerifyOptions, Payload>(verify)(
      token,
      secret,
      options
    ).catch(({ message }: JsonWebTokenError) => {
      throw new JsonWebTokenValidateError(message)
    })
  )

export const validate =
  <A extends ZodRawShape>(schema: ZodObject<A>) =>
  (token: JsonWebToken, options: VerifyOptions) =>
    decode(token, options).then(decoded => schema.parseAsync(decoded))

export const refreshTokenPayload = object({ sub: string().uuid() })

export const refresh = (token: RefreshToken): Promise<AccessToken> =>
  validate(refreshTokenPayload)(token, { complete: false })
    .then(({ sub }) => selectCredential({ id: sub }))
    .then(issueAccessToken)
