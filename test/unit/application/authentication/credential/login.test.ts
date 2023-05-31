import { it, describe, expect, vi } from 'vitest'
import { compare } from 'bcryptjs'

import { login } from '../../../../../source/application/authentication/credential/login'
import { selectCredential } from '../../../../../source/periphery/persistence/repository/credential'
import { entity } from '../../../periphery/infrastructure/identity'
import type { AuthenticationDetails } from '../../../../../source/application/common/authentication/authenticate'
import type { Credential } from '../../../../../source/domain/authentication/credential/model'
import type { Entity } from '../../../../../source/application/abstraction/identity'
import type {
  AccessToken,
  RefreshToken
} from '../../../../../source/domain/authentication/token/model'

vi.mock('bcryptjs', () => ({ compare: vi.fn().mockResolvedValue(true) }))

vi.mock('../../../../../source/periphery/persistence/repository/credential')
vi.mocked(selectCredential).mockReturnValue(
  entity({ name: 'n', email: 'e', password: 'p' })
)

describe.concurrent('Given a user credential', () => {
  const credential: Credential = {
    name: 'Michael Johnson',
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
