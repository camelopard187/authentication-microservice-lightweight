import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

import { client } from '~/periphery/persistence/database-client'
import { application } from '~/periphery/presentation/application'
import { issueRefreshToken } from '~/application/common/authentication/authenticate'
import type {
  AccessToken,
  RefreshToken
} from '~/domain/authentication/token/model'

afterAll(async () => {
  await client.credential.deleteMany({})
  await client.$disconnect()
})

describe.concurrent('Given a refresh token', async () => {
  const previous = await request(application)
    .post('/v1/register')
    .send({ name: 'Mary Smith', email: 'mary@gmail.com', password: 'sKdBsAFb' })

  describe('When making a POST request to /v1/refresh', async () => {
    const response = await request(application)
      .post('/v1/refresh')
      .set('Cookie', previous.get('set-cookie'))

    it('Then it should return a 200 status code', () => {
      expect(response.status).toBe(200)
    })

    it('Then it should return an access token', () => {
      expect(response.body).toEqual<{ access: AccessToken }>({
        access: expect.any(String) as AccessToken
      })
    })
  })
})

describe.concurrent('Given a malformed refresh token', () => {
  const token: RefreshToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJpYXQiOjE2NzY2NjQ4Mjd9'

  describe('When making a POST request to /v1/refresh', async () => {
    const response = await request(application)
      .post('/v1/refresh')
      .set('Cookie', [`refresh-token=${token}`])

    it('Then it should return a 400 status code', () => {
      expect(response.status).toBe(400)
    })

    it('Then it should return a JsonWebTokenValidateError', () => {
      expect(response.body).toEqual<Error>({
        name: 'JsonWebTokenValidateError',
        message: 'jwt malformed'
      })
    })
  })
})

describe.concurrent('Given a mismatched refresh token', async () => {
  const token: RefreshToken = await issueRefreshToken({
    id: 'clifwg0oa000008lb63we3i59',
    email: 'johnanderson@outlook.com',
    password: 'KgsK9dBsFpT2mAFb1'
  })

  describe('When making a POST request to /v1/refresh', async () => {
    const response = await request(application)
      .post('/v1/refresh')
      .set('Cookie', [`refresh-token=${token}`])

    it('Then it should return a 400 status code', () => {
      expect(response.status).toBe(400)
    })

    it('Then it should return a InvalidCredentialError', () => {
      expect(response.body).toEqual<Error>({
        name: 'InvalidCredentialError',
        message: 'Credentials not found for the provided token'
      })
    })
  })
})
