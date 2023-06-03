import jsonwebtoken from 'jsonwebtoken'
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

export const issue = <T extends JsonWebToken>(
  payload: Payload,
  options?: SignOptions
) => sign(payload, env.PRIVATE_KEY, options) as Promise<T>

export const issueAccessToken = ({ id, email }: Entity<Credential>) =>
  issue<AccessToken>(
    { sub: id, data: { email } },
    { algorithm: 'RS256', expiresIn: '15m' }
  )

export const issueRefreshToken = ({ id }: Entity<Credential>) =>
  issue<RefreshToken>({ sub: id }, { algorithm: 'RS256', expiresIn: '30d' })

export const authenticate = async (
  entity: Entity<Credential>
): Promise<AuthenticationDetails> => ({
  client: entity.id,
  tokens: {
    access: await issueAccessToken(entity),
    refresh: await issueRefreshToken(entity)
  }
})
