import { hash } from 'bcryptjs'
import { assoc } from 'rambda'

import { authenticate } from '../../common/authentication/authenticate'
import { insertCredential } from '../../../periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '../../common/authentication/authenticate'
import type { Credential } from '../../../domain/authentication/credential/model'

const hashCredential = async (credential: Credential) =>
  assoc('password', await hash(credential.password, 10), credential)

export const register = (credential: Credential): Promise<AuthenticationDetails> =>
  hashCredential(credential).then(insertCredential).then(authenticate)
