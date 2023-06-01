import jsonwebtoken from 'jsonwebtoken'
import { omit } from 'rambda'
import { promisify } from 'node:util'
import type { SignOptions, Secret } from 'jsonwebtoken'

import { env } from '~/common/environment'
import type {
  AccessToken,
  RefreshToken,
  TokenPair
} from '~/domain/authentication/token/model'
import type { Credential } from '~/domain/authentication/credential/model'
import type { Entity } from '~/application/abstraction/identity'

export type Payload = object
export type JsonWebToken = string

export type AuthenticationDetails = {
  client: Entity<Credential>['id']
  tokens: TokenPair
}

export const sign = promisify<
  Payload,
  Secret,
  SignOptions | undefined,
  JsonWebToken
>(jsonwebtoken.sign)

export const issue = (payload: Payload, options?: SignOptions) =>
  sign(payload, env.PRIVATE_KEY, options)

export const issueAccessToken = ({
  id,
  ...data
}: Entity<Credential>): Promise<AccessToken> =>
  issue(
    { sub: id, data: omit(['password'], data) },
    { algorithm: 'RS256', expiresIn: '15m' }
  )

export const issueRefreshToken = ({
  id
}: Entity<Credential>): Promise<RefreshToken> =>
  issue({ sub: id }, { algorithm: 'RS256', expiresIn: '30d' })

export const authenticate = async (
  entity: Entity<Credential>
): Promise<AuthenticationDetails> => ({
  client: entity.id,
  tokens: {
    access: await issueAccessToken(entity),
    refresh: await issueRefreshToken(entity)
  }
})
