import { object, string } from 'zod'
import type { infer as Infer } from 'zod'

export const name = string()

export const email = string().email('Provided the wrong email')

export const password = string()
  .min(8, 'Password is too short - should be 8 chars minimum')
  .max(24, 'Password is too long - should be 24 chars maximum')

export const credential = object({ name, email, password }).required()

export type Credential = Infer<typeof credential>
