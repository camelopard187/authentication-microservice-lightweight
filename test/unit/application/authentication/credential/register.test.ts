import { it, describe, expect, vi } from 'vitest'
import { compare } from 'bcryptjs'

import { register } from '~/application/authentication/credential/register'
import { insertCredential } from '~/periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '~/application/common/authentication/authenticate'
import type { Credential } from '~/domain/authentication/credential/model'
import type { Entity } from '~/application/abstraction/identity'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

vi.mock('~/periphery/persistence/repository/credential', () => ({
  insertCredential: vi.fn(credential =>
    Promise.resolve({ id: '0', ...credential })
  )
}))

describe.concurrent('Given a unique credential', () => {
  const credential: Credential = {
    name: 'Michael Johnson',
    email: 'mjohnson@outlook.com',
    password: 'tjh7vB1WpUzYJtjmg'
  }

  describe('When calling the register function with credential', async () => {
    const details = await register(credential)

    it('Then it should hash the credential password', async () => {
      const hash = vi.mocked(insertCredential).mock.calls[0]?.[0].password
      expect(await compare(credential.password, hash as string)).toBeTruthy()
    })

    it('Then it should insert the credential into a database', () => {
      expect(insertCredential).toHaveBeenCalledWith<[Credential]>({
        ...credential,
        password: expect.not.stringContaining(credential.password) as string
      })
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
