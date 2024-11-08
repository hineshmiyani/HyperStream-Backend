import { Router } from 'express'

import {
  followUser,
  getFollowedUsers,
  isUserAlreadyFollowing,
  unfollowUser,
} from '@/controllers/follow.controller'
import { verifyJWT } from '@/middlewares/auth.middleware'
import {
  validateFollowUserData,
  validateIsUserFollowing,
  validateIsUserNotFollowing,
} from '@/middlewares/follow.middleware'

const router = Router()

router.get('/is-following/:followingId', validateFollowUserData, isUserAlreadyFollowing)

router.post('/follow', verifyJWT, validateFollowUserData, validateIsUserNotFollowing, followUser)
router.post('/unfollow', verifyJWT, validateFollowUserData, validateIsUserFollowing, unfollowUser)

router.get('/followed-users', verifyJWT, getFollowedUsers)

export default router
