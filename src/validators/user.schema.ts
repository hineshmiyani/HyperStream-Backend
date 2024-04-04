import { z } from 'zod'

const baseUserSchema = z.object({
  username: z.string().trim().toLowerCase(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().trim().min(8),
})

const registerUserSchema = baseUserSchema.extend({
  avatar: z.string().or(z.string().url()).optional(),
  coverImage: z.string().or(z.string().url()).optional(),
})

const loginUserSchema = baseUserSchema
  .partial({
    username: true,
    email: true,
  })
  .refine((data) => data.username || data.email, {
    message: 'Either username or email is required',
  })

export { registerUserSchema, loginUserSchema }
