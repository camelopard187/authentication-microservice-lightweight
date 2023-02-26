import { randomUUID } from 'crypto'

export const entity = <A>(a: A) => Promise.resolve({ id: randomUUID(), ...a })
