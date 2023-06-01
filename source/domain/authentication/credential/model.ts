import { z } from 'zod'

export const name = z.string()

export const email = z.string().email('Provided the wrong email')

export const password = z
  .string()
  .min(8, 'Password is too short - should be 8 chars minimum')
  .max(24, 'Password is too long - should be 24 chars maximum')

export const credential = z.object({ name, email, password }).required()

export type Credential = z.infer<typeof credential>
