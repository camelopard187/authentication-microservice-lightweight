import { describe, expect, it, vi } from 'vitest'
import { randomUUID } from 'node:crypto'

import { issue } from '~/application/common/authentication/authenticate'
import { refresh } from '~/application/authentication/token/refresh'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

vi.mock('~/periphery/persistence/repository/credential', () => ({
  selectCredential: vi
    .fn()
    .mockResolvedValue({ id: '0', name: 'n', email: 'e', password: 'p' })
}))

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
