import express from 'express'

import { loginUser, registerUser } from '@/controllers/user.controller'
import {
  isUserExist,
  validateLoginUserData,
  validateRegisterUserData,
} from '@/middlewares/user.middleware'

const router = express.Router()

router.post('/register', validateRegisterUserData, isUserExist, registerUser)
router.post('/login', validateLoginUserData, loginUser)

export default router
