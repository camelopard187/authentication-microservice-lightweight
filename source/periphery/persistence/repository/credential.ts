import type { Prisma } from '@prisma/client'

import { client } from '~/periphery/persistence/database-client'
import type { Credential } from '~/domain/authentication/credential/model'
import type { Entity } from '~/application/abstraction/identity'

export const insertCredential = (
  credential: Credential
): Promise<Entity<Credential>> => client.credential.create({ data: credential })

export const selectCredential = (
  where: Prisma.CredentialWhereInput
): Promise<Entity<Credential> | null> => client.credential.findFirst({ where })
