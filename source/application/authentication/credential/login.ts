import { compare } from 'bcryptjs'
import { BadRequest } from 'http-errors'
import type { infer as Infer } from 'zod'

import { authenticate } from '~/application/common/authentication/authenticate'
import { credential } from '~/domain/authentication/credential/model'
import { selectCredential } from '~/periphery/persistence/repository/credential'
import type { AuthenticationDetails } from '~/application/common/authentication/authenticate'

export class InvalidCredentialError extends BadRequest {
  readonly name = 'InvalidCredentialError'
}

export const candidate = credential.pick({ email: true, password: true })

export type Candidate = Infer<typeof candidate>

export const login = async (
  candidate: Candidate
): Promise<AuthenticationDetails> => {
  const entity = await selectCredential({ email: candidate.email }).catch(
    () => {
      throw new InvalidCredentialError(
        'The provided email or password is incorrect'
      )
    }
  )

  if (await compare(candidate.password, entity.password))
    return await authenticate(entity)
  else
    throw new InvalidCredentialError(
      'The provided email or password is incorrect'
    )
}
