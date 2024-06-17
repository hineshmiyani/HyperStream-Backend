import { Router } from 'express'

import {
  changeCurrentPassword,
  getAllUsers,
  getCurrentUser,
  loginUser,
  loginUserWithGoogleOrFacebook,
  logoutUser,
  refreshAccessToken,
  resendVerificationEmail,
  resetPassword,
  sendPasswordRecoveryEmail,
  signUpUser,
  updateAccountDetails,
  verifyUserEmail,
} from '@/controllers/user.controller'
import ENV from '@/env'
import { passport, verifyJWT } from '@/middlewares/auth.middleware'
import {
  isUserExist,
  validateChangePasswordData,
  validateLoginUserData,
  validateResetPasswordData,
  validateSignUpUserData,
  validateUpdateUserAccountData,
  validateUserEmail,
  validateUserId,
} from '@/middlewares/user.middleware'

const router = Router()

// Public Routes
router.post('/signup', validateSignUpUserData, isUserExist, signUpUser)
router.post('/login', validateLoginUserData, loginUser)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: ENV.FRONTEND_BASE_URL, // Frontend failureRedirect route
    // successRedirect: ENV.FRONTEND_BASE_URL, // Frontend successRedirect route
    session: false,
  }),
  loginUserWithGoogleOrFacebook
)

router.get('/facebook', passport.authenticate('facebook'))
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: ENV.FRONTEND_BASE_URL, // Frontend failureRedirect route
    // successRedirect: ENV.FRONTEND_BASE_URL, // Frontend successRedirect route
    session: false,
  }),
  loginUserWithGoogleOrFacebook
)

router.post('/refresh-token', refreshAccessToken)
router.post('/password-recovery-email', validateUserEmail, sendPasswordRecoveryEmail)
router.post('/reset-password', validateResetPasswordData, resetPassword)
router.post('/resend-verification-email', validateUserEmail, resendVerificationEmail)
router.get('/all-users', validateUserId, getAllUsers)

// Protected Routes
router.get('/current-user', verifyJWT, getCurrentUser)
router.post('/verify-email', verifyJWT, verifyUserEmail)
router.post('/logout', verifyJWT, logoutUser)
router.post('/change-password', verifyJWT, validateChangePasswordData, changeCurrentPassword)
router.patch('/update-account', verifyJWT, validateUpdateUserAccountData, updateAccountDetails)

export default router
