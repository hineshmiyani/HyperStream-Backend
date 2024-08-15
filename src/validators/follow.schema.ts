import { z } from 'zod'

import { idSchema } from '@/validators/common.schema'

const followSchema = z.object({
  followerId: idSchema.optional(),
  followingId: idSchema,
})

export { followSchema }
