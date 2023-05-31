import { hash } from 'bcryptjs'
import { BadRequest } from 'http-errors'
import type { Prisma } from '@prisma/client'

import { authenticate } from '../../common/authentication/authenticate'
import { insertCredential } from '../../../periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '../../common/authentication/authenticate'
import type { Credential } from '../../../domain/authentication/credential/model'

export class DuplicateCredentialError extends BadRequest {
  readonly name = 'DuplicateCredentialError'
}

export const register = async (
  credential: Credential
): Promise<AuthenticationDetails> => {
  const password = await hash(credential.password, 10)

  const inserted = await insertCredential({ ...credential, password }).catch(
    ({ message }: Prisma.PrismaClientKnownRequestError) => {
      throw new DuplicateCredentialError(message)
    }
  )

  return await authenticate(inserted)
}
