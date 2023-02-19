import { hash } from 'bcryptjs'
import { assoc } from 'rambda'

import { insertCredential } from '../../../periphery/persistence/repository/credential'
import type { Credential } from '../../../domain/authentication/credential/model'

const hashCredential = async (credential: Credential) =>
  assoc('password', await hash(credential.password, 10), credential)

export const register = (credential: Credential) => hashCredential(credential).then(insertCredential)
