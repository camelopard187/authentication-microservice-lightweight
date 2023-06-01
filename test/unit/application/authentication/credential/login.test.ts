import { it, describe, expect, vi } from 'vitest'
import { compare } from 'bcryptjs'

import { login } from '~/application/authentication/credential/login'
import type { AuthenticationDetails } from '~/application/common/authentication/authenticate'
import type { Credential } from '~/domain/authentication/credential/model'
import type { Entity } from '~/application/abstraction/identity'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

vi.mock('bcryptjs', () => ({ compare: vi.fn().mockResolvedValue(true) }))
vi.mock('~/periphery/persistence/repository/credential', () => ({
  selectCredential: vi
    .fn()
    .mockResolvedValue({ id: '0', email: 'e', password: 'p' })
}))

describe.concurrent('Given a user credential', () => {
  const credential: Credential = {
    email: 'mjohnson@outlook.com',
    password: 'tjh7vB1WpUzYJtjmg'
  }

  describe('When calling the login function with credential', async () => {
    const details = await login(credential)

    it('Then it should verify the credential password', () => {
      expect(compare).toHaveBeenCalledWith(credential.password, 'p')
    })

    it('Then it should return authentication details', () => {
      expect(details).toEqual<AuthenticationDetails>({
        client: expect.any(String) as Entity<Credential>['id'],
        tokens: {
          access: expect.any(String) as AccessToken,
          refresh: expect.any(String) as RefreshToken
        }
      })
    })
  })
})
