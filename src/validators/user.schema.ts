import { z } from 'zod'

const userSchema = z.object({
  name: z.string().trim(),
  email: z.string().email().toLowerCase().trim(),
})

export { userSchema }
