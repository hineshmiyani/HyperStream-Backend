import { Router } from 'express'

import {
  generateStreamConnection,
  getStreamByUserId,
  onStreamEnd,
  onStreamStart,
  updateStream,
} from '@/controllers/stream.controller'
import { verifyJWT } from '@/middlewares/auth.middleware'
import {
  validateStreamEndData,
  validateStreamStartData,
  validateUpdateStreamData,
} from '@/middlewares/stream.middleware'
import { validateUserId } from '@/middlewares/user.middleware'

const router = Router()

router.get('/u/:userId', validateUserId, getStreamByUserId)

router.put('/update-stream', verifyJWT, validateUpdateStreamData, updateStream)

router.put('/generate-stream-connection', verifyJWT, generateStreamConnection)

router.post('/start', validateStreamStartData, onStreamStart)

router.post('/end', validateStreamEndData, onStreamEnd)

export default router
