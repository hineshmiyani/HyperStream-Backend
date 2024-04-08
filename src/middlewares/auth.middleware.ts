import { AuthProvider, User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { prisma } from '@/db/prisma'
import ENV from '@/env'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENV.ACCESS_TOKEN_SECRET,
}

const generateUsername = async (displayName: string): Promise<string> => {
  const username = displayName?.replace(' ', '')?.toLowerCase() + Math.floor(Math.random() * 10000)

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (existingUser) {
    return await generateUsername(displayName)
  }

  return username
}

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: payload?.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          coverImage: true,
          displayName: true,
          googleId: true,
          facebookId: true,
          authProviders: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { id: googleId, emails, displayName, photos } = profile
        const email = emails?.[0]?.value || ''
        const avatar = photos?.[0]?.value || ''

        let user = await prisma.user.findUnique({ where: { googleId } })

        // if profile email already exists then only update googleId
        if (!user) {
          const existingUser = await prisma.user.findUnique({ where: { email } })

          if (existingUser) {
            user = await prisma.user.update({
              where: { email },
              data: {
                googleId,
                authProviders: {
                  push: AuthProvider.GOOGLE,
                },
              },
            })
          }
        }

        if (!user) {
          const username = await generateUsername(displayName)
          user = await prisma.user.create({
            data: {
              googleId,
              username,
              displayName,
              email,
              avatar,
              authProviders: [AuthProvider.GOOGLE],
            },
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error as string | Error, false)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: ENV.FACEBOOK_CLIENT_ID,
      clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
      callbackURL: ENV.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'photos', 'displayName'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { id: facebookId, emails, displayName, photos } = profile
        const email = emails?.[0]?.value || ''
        const avatar = photos?.[0]?.value || ''

        let user = await prisma.user.findUnique({ where: { facebookId } })

        // if profile email already exists then only update facebookId
        if (!user) {
          const existingUser = await prisma.user.findUnique({ where: { email } })

          if (existingUser) {
            user = await prisma.user.update({
              where: { email },
              data: {
                facebookId,
                authProviders: {
                  push: AuthProvider.FACEBOOK,
                },
              },
            })
          }
        }

        const username = await generateUsername(displayName)

        if (!user) {
          user = await prisma.user.create({
            data: {
              facebookId,
              username,
              displayName,
              email,
              avatar,
              authProviders: [AuthProvider.FACEBOOK],
            },
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error as string | Error, false)
      }
    }
  )
)

const verifyJWT = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: unknown, user: Partial<User>, info: Record<string, string>) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        throw ApiError.Api401Error({ message: info?.message })
      }

      // Attach user to the request object
      req.user = user

      next()
    }
  )(req, res, next)
})

export { passport, verifyJWT }
