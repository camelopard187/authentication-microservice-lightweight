import 'dotenv/config'
import { z } from 'zod'

export const environment = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

  DATABASE_URL: z.string().url(),
  PORT: z.number().optional(),

  PRIVATE_KEY: z.string()
})

export type Environment = z.infer<typeof environment>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends Environment {}
  }
}

export const env = environment.parse(process.env)
