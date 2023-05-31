import config from 'config'
import { object, string } from 'zod'
import { readFile } from 'fs/promises'
import { verify } from 'jsonwebtoken'
import { promisify } from 'util'
import type { VerifyOptions, Secret } from 'jsonwebtoken'
import type { ZodObject, ZodRawShape } from 'zod/lib'

import { issueAccessToken } from '../../common/authentication/authenticate'
import { selectCredential } from '../../../periphery/persistence/repository/credential'
import type {
  JsonWebToken,
  Payload
} from '../../common/authentication/authenticate'
import type {
  AccessToken,
  RefreshToken
} from '../../../domain/authentication/token/model'

export const decode = (
  token: JsonWebToken,
  options: VerifyOptions
): Promise<Payload> =>
  readFile(config.get('key.public.path'), 'utf8').then(secret =>
    promisify<JsonWebToken, Secret, VerifyOptions, Payload>(verify)(
      token,
      secret,
      options
    )
  )

export const validate =
  <A extends ZodRawShape>(schema: ZodObject<A>) =>
  (token: JsonWebToken, options: VerifyOptions) =>
    decode(token, options).then(schema.parseAsync)

export const refreshTokenPayload = object({ sub: string().uuid() })

export const refresh = (token: RefreshToken): Promise<AccessToken> =>
  validate(refreshTokenPayload)(token, { complete: false })
    .then(({ sub }) => selectCredential({ id: sub }))
    .then(issueAccessToken)
