import { z } from 'zod'

import { idSchema } from '@/validators/common.schema'

const streamSchema = z.object({
  name: z.string(),
  thumbnailUrl: z.string().optional(),
  ingressId: z.string().optional(),
  serverUrl: z.string().optional(),
  streamKey: z.string().optional(),
  isLive: z.boolean(),
  isChatEnabled: z.boolean(),
  isChatDelayed: z.boolean(),
  isChatFollowersOnly: z.boolean(),
  userId: idSchema,
})

const updateStreamSchema = streamSchema.pick({
  name: true,
  isChatEnabled: true,
  isChatDelayed: true,
  isChatFollowersOnly: true,
})

const verifyStreamKeySchema = streamSchema.pick({ name: true, streamKey: true })

export { streamSchema, updateStreamSchema, verifyStreamKeySchema }
