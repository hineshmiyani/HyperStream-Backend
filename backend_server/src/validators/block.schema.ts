import { z } from 'zod'

import { idSchema } from '@/validators/common.schema'

const blockSchema = z.object({
  userId: idSchema.optional(),
  otherUserId: idSchema,
})

export { blockSchema }
