import { it, describe, expect, vi } from 'vitest'
import { compare } from 'bcryptjs'

import { login } from '../../../../../source/application/authentication/credential/login'
import { selectCredential } from '../../../../../source/periphery/persistence/repository/credential'
import { entity } from '../../../periphery/infrastructure/identity'

vi.mock('bcryptjs', () => ({ compare: vi.fn().mockResolvedValue(true) }))

vi.mock('../../../../../source/periphery/persistence/repository/credential')
vi.mocked(selectCredential).mockReturnValue(entity({ name: 'n', email: 'e', password: 'p' }))

describe.concurrent('Given a user credential', () => {
  const credential = {
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
      expect(details).toEqual({
        client: expect.any(String),
        tokens: { access: expect.any(String), refresh: expect.any(String) }
      })
    })
  })
})
