import request from 'supertest'
import { concat, modify } from 'rambda'
import { afterAll, describe, expect, it } from 'vitest'

import { client } from '../../../../../source/periphery/persistence/database-client'
import { application } from '../../../../../source/periphery/presentation/application'
import type { Credential } from '../../../../../source/domain/authentication/credential/model'
import type { AuthenticationDetails } from '../../../../../source/application/common/authentication/authenticate'
import type { Entity } from '../../../../../source/application/abstraction/identity'
import type {
  AccessToken,
  RefreshToken
} from '../../../../../source/domain/authentication/token/model'

afterAll(async () => {
  await client.credential.deleteMany({})
  await client.$disconnect()
})

describe.concurrent('Given a registered credential', async () => {
  const credential: Credential = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'ynGkUbnFDlac'
  }

  await request(application).post('/v1/register').send(credential)

  describe('When making a POST request to /v1/login', async () => {
    const response = await request(application)
      .post('/v1/login')
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

  describe('When making an invalid POST request to /v1/login', async () => {
    const response = await request(application)
      .post('/v1/login')
      .send(modify('password', concat('invalid '), credential))

    it('Then it should return a 400 status code', () => {
      expect(response.status).toBe(400)
    })

    it('Then it should return an Error', () => {
      expect(response.body).toMatchObject<Error>({
        name: 'InvalidCredentialError',
        message: expect.stringContaining(
          'The provided email or password is incorrect'
        ) as string
      })
    })
  })
})

describe.concurrent('Given an unregistered credential', () => {
  const credential: Credential = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    password: 'hfKopMertLnd'
  }

  describe('When making a POST request to /v1/login', async () => {
    const response = await request(application)
      .post('/v1/login')
      .send(credential)

    it('Then it should return a 500 status code', () => {
      expect(response.status).toBe(500)
    })

    it('Then it should return an Error', () => {
      expect(response.body).toMatchObject<Error>({
        name: 'NotFoundError',
        message: expect.stringContaining('No Credential found') as string
      })
    })
  })
})
