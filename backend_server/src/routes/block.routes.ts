import { Router } from 'express'

import { blockUser, isUserBlocked, unblockUser } from '@/controllers/block.controller'
import { verifyJWT } from '@/middlewares/auth.middleware'
import {
  validateBlockUserData,
  validateIsUserAlreadyBlocked,
  validateIsUserNotAlreadyBlocked,
} from '@/middlewares/block.middleware'

const router = Router()

router.get('/is-blocked/:userId/:otherUserId', validateBlockUserData, isUserBlocked)

router.post(
  '/block-user',
  verifyJWT,
  validateBlockUserData,
  validateIsUserNotAlreadyBlocked,
  blockUser
)
router.post(
  '/unblock-user',
  verifyJWT,
  validateBlockUserData,
  validateIsUserAlreadyBlocked,
  unblockUser
)

router.get('/blocked-users', verifyJWT)

export default router
