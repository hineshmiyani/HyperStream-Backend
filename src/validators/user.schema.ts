import { z } from 'zod'

import { passwordRegex, usernameRegex } from '@/utils/regex'

const baseUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      message: 'Username must be at least 3 characters.',
    })
    .refine((username) => username.match(usernameRegex), {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),
  email: z.string().email().trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .refine((password) => password.match(passwordRegex), {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
})

const extendedUserSchema = baseUserSchema
  .extend({
    displayName: z.string(),
    bio: z.string(),
    avatar: z.string().or(z.string().url()),
    coverImage: z.string().or(z.string().url()),
  })
  .partial()

const signUpUserSchema = baseUserSchema

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

const changePasswordSchema = z.object({
  oldPassword: baseUserSchema.shape.password,
  newPassword: baseUserSchema.shape.password,
})

const updateUserSchema = extendedUserSchema.omit({ password: true, email: true })

export {
  baseUserSchema,
  changePasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  signUpUserSchema,
  updateUserSchema,
}
