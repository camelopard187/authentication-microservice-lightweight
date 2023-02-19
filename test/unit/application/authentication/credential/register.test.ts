import { it, describe, expect, vi } from 'vitest'
import { compare } from 'bcryptjs'

import { register } from '../../../../../source/application/authentication/credential/register'
import { insertCredential } from '../../../../../source/periphery/persistence/repository/credential'

vi.mock('../../../../../source/periphery/persistence/repository/credential')

describe.concurrent('Given a unique credential', () => {
  const credential = {
    name: 'Michael Johnson',
    email: 'mjohnson@outlook.com',
    password: 'tjh7vB1WpUzYJtjmg'
  }

  describe('When calling the register function with credential', async () => {
    await register(credential)

    it('Then it should hash the credential password', async () => {
      const hash = vi.mocked(insertCredential).mock.calls[0][0].password
      expect(await compare(credential.password, hash)).toBeTruthy()
    })

    it('Then it should insert the credential into a database', () => {
      expect(insertCredential).toHaveBeenCalledWith({
        ...credential,
        password: expect.not.stringContaining(credential.password)
      })
    })
  })
})
