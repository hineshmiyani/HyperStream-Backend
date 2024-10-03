import { Router } from 'express'

import { getStreamByUserId, updateStream } from '@/controllers/stream.controller'
import { verifyJWT } from '@/middlewares/auth.middleware'
import { validateUpdateStreamData } from '@/middlewares/stream.middleware'
import { validateUserId } from '@/middlewares/user.middleware'

const router = Router()

router.get('/u/:userId', validateUserId, getStreamByUserId)

router.put('/update-stream', verifyJWT, validateUpdateStreamData, updateStream)

export default router
