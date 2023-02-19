import { client } from '../database-client'
import type { Credential } from '../../../domain/authentication/credential/model'
import type { Entity } from '../../../application/abstraction/identity'

export const insertCredential = (credential: Credential): Promise<Entity<Credential>> =>
  client.credential.create({ data: credential })
