import { describe, expect, it, vi } from 'vitest'
import { randomUUID } from 'crypto'

import { issue } from '../../../../../source/application/common/authentication/authenticate'
import { refresh } from '../../../../../source/application/authentication/token/refresh'
import { selectCredential } from '../../../../../source/periphery/persistence/repository/credential'
import { entity } from '../../../periphery/infrastructure/identity'
import type {
  AccessToken,
  RefreshToken
} from '../../../../../source/domain/authentication/token/model'

vi.mock('../../../../../source/periphery/persistence/repository/credential')
vi.mocked(selectCredential).mockReturnValue(
  entity({ name: 'n', email: 'e', password: 'p' })
)

describe('Given a refresh token', async () => {
  const token: RefreshToken = await issue(
    { sub: randomUUID() },
    { algorithm: 'RS256' }
  )

  describe('When calling the refresh function with token', async () => {
    const access: AccessToken = await refresh(token)

    it('Then it should return an access token', () => {
      expect(access).toEqual<AccessToken>(expect.any(String) as string)
    })
  })
})

describe('Given a malformed refresh token', () => {
  const token: RefreshToken =
    'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpYXQiOjE2NzY2NjI3NjV9'

  describe('When calling the refresh function with token', () => {
    const details = () => refresh(token)

    it('Then it should throw jwt malformed error', async () => {
      await expect(details).rejects.toThrowError('jwt malformed')
    })
  })
})
