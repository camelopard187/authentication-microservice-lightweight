import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'

import { client } from '../../../../../source/periphery/persistence/database-client'
import { application } from '../../../../../source/periphery/presentation/application'

afterAll(async () => {
  await client.credential.deleteMany({})
  await client.$disconnect()
})

describe.concurrent('Given a unique credential', () => {
  const credential = {
    name: 'Jane Smith',
    email: 'jsmith@outlook.com',
    password: 'sKdFkn34sAfF'
  }

  describe('When making a POST request to /v1/register', async () => {
    const response = await request(application).post('/v1/register').send(credential)

    it('Then it should return a 200 status code', () => {
      expect(response.status).toBe(200)
    })

    it('Then it should return authentication details', () => {
      expect(response.body).toEqual({
        client: expect.any(String),
        tokens: { access: expect.any(String), refresh: expect.any(String) }
      })
    })

    it('Then it should set the refresh token in cookies', () => {
      expect(response.header['set-cookie']).toEqual([
        expect.stringContaining(`refresh-token=${response.body.tokens.refresh}`)
      ])
    })
  })
})

describe.concurrent('Given a duplicate credential object', async () => {
  const credential = {
    name: 'Emily Davis',
    email: 'emilydavis@gmail.com',
    password: 'dS3sfgGf8a'
  }

  await request(application).post('/v1/register').send(credential)

  describe('When making a POST request to /v1/register', async () => {
    const response = await request(application).post('/v1/register').send(credential)

    it('Then it should return a 500 status code', () => {
      expect(response.status).toBe(500)
    })

    it('Then it should return an Error', () => {
      expect(response.body).toMatchObject({
        name: 'Error',
        message: expect.stringContaining('Unique constraint failed on the fields')
      })
    })
  })
})
