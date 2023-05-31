import { hash } from 'bcryptjs'

import { authenticate } from '../../common/authentication/authenticate'
import { insertCredential } from '../../../periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '../../common/authentication/authenticate'
import type { Credential } from '../../../domain/authentication/credential/model'

export const register = (
  credential: Credential
): Promise<AuthenticationDetails> =>
  hash(credential.password, 10)
    .then(password => insertCredential({ ...credential, password }))
    .then(authenticate)
