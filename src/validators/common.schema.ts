import { z } from 'zod'

const idSchema = z.string().uuid()

export { idSchema }
