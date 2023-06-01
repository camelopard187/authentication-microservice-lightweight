import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

import { client } from '~/periphery/persistence/database-client'
import { application } from '~/periphery/presentation/application'
import type { AuthenticationDetails } from '~/application/common/authentication/authenticate'
import type { Credential } from '~/domain/authentication/credential/model'
import type { Entity } from '~/application/abstraction/identity'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

afterAll(async () => {
  await client.credential.deleteMany({})
  await client.$disconnect()
})

describe.concurrent('Given a unique credential', () => {
  const credential: Credential = {
    email: 'jsmith@outlook.com',
    password: 'sKdFkn34sAfF'
  }

  describe('When making a POST request to /v1/register', async () => {
    const response = await request(application)
      .post('/v1/register')
      .send(credential)

    it('Then it should return a 200 status code', () => {
      expect(response.status).toBe(200)
    })

    it('Then it should return authentication details', () => {
      expect(response.body).toEqual<AuthenticationDetails>({
        client: expect.any(String) as Entity<Credential>['id'],
        tokens: {
          access: expect.any(String) as AccessToken,
          refresh: expect.any(String) as RefreshToken
        }
      })
    })

    it('Then it should set the refresh token in cookies', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.header['set-cookie']).toEqual<[string]>([
        expect.stringContaining(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `refresh-token=${response.body?.tokens?.refresh as string}`
        ) as string
      ])
    })
  })
})

describe.concurrent('Given a duplicate credential object', async () => {
  const credential: Credential = {
    email: 'emilydavis@gmail.com',
    password: 'dS3sfgGf8a'
  }

  await request(application).post('/v1/register').send(credential)

  describe('When making a POST request to /v1/register', async () => {
    const response = await request(application)
      .post('/v1/register')
      .send(credential)

    it('Then it should return a 400 status code', () => {
      expect(response.status).toBe(400)
    })

    it('Then it should return an DuplicateCredentialError', () => {
      expect(response.body).toMatchObject<Error>({
        name: 'DuplicateCredentialError',
        message: expect.stringContaining(
          'Unique constraint failed on the fields'
        ) as string
      })
    })
  })
})
