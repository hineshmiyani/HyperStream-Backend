import { Router } from 'express'

import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  loginUserWithGoogleOrFacebook,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  sendPasswordRecoveryEmail,
  verifyUserEmail,
} from '@/controllers/user.controller'
import { passport, verifyJWT } from '@/middlewares/auth.middleware'
import {
  isUserExist,
  validateLoginUserData,
  validateRegisterUserData,
  validateResetPasswordData,
  validateUserEmail,
} from '@/middlewares/user.middleware'

const router = Router()

router.post('/register', validateRegisterUserData, isUserExist, registerUser)
router.post('/login', validateLoginUserData, loginUser)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', {
    // failureRedirect: '/login',  // Frontend failureRedirect route
    // successRedirect: '/', // Frontend successRedirect route
    session: false,
  }),
  loginUserWithGoogleOrFacebook
)

router.get('/facebook', passport.authenticate('facebook'))
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    // failureRedirect: '/login',  // Frontend failureRedirect route
    // successRedirect: '/', // Frontend successRedirect route
    session: false,
  }),
  loginUserWithGoogleOrFacebook
)

router.get('/current-user', verifyJWT, getCurrentUser)
router.post('/verify-email', verifyJWT, verifyUserEmail)
router.post('/resend-verification-email', validateUserEmail, resendVerificationEmail)
router.post('/logout', verifyJWT, logoutUser)
router.post('/refresh-token', refreshAccessToken)
router.post('/change-password', verifyJWT, changeCurrentPassword)
router.post('/password-recovery-email', validateUserEmail, sendPasswordRecoveryEmail)
router.post('/reset-password', validateResetPasswordData, resetPassword)

export default router
