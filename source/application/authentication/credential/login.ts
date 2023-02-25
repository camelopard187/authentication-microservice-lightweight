import { compare } from 'bcryptjs'

import { authenticate } from '../../common/authentication/authenticate'
import { selectCredential } from '../../../periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '../../common/authentication/authenticate'
import type { Credential } from '../../../domain/authentication/credential/model'

export class InvalidCredentialError extends Error {
  readonly status = 400
  readonly name = 'InvalidCredentialError'
  constructor(message: string) {
    super(message)
  }
}

export const login = (credential: Pick<Credential, 'email' | 'password'>): Promise<AuthenticationDetails> =>
  selectCredential({ email: credential.email })
    .then(async selected =>
      (await compare(credential.password, selected.password))
        ? Promise.resolve(selected)
        : Promise.reject(new InvalidCredentialError('Provided invalid credential'))
    )
    .then(authenticate)
