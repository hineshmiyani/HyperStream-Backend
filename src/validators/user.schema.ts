import { z } from 'zod'

const baseUserSchema = z.object({
  username: z
    .string()
    .toLowerCase()
    .transform((username) => username.replace(/ /g, '')),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().trim().min(8),
})

const registerUserSchema = baseUserSchema.extend({
  displayName: z.string().optional(),
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

const resetPasswordSchema = baseUserSchema.pick({ password: true }).extend({
  token: z.string().trim(),
})

export { baseUserSchema, registerUserSchema, loginUserSchema, resetPasswordSchema }
