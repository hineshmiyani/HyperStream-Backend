import { PrismaClient, User } from '@prisma/client'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Request, Response, NextFunction } from 'express'

import ENV from '@/env'
import { asyncHandler } from '@/utils/asyncHandler'
import { ApiError } from '@/utils/errorHandling/ApiError'

const prisma = new PrismaClient()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENV.ACCESS_TOKEN_SECRET,
}

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: payload.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          coverImage: true,
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

const verifyJWT = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: unknown, user: Partial<User>, info: Record<string, string>) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        throw ApiError.Api401Error({ message: info.message })
      }

      // Attach user to the request object
      req.user = user

      next()
    }
  )(req, res, next)
})

export { passport, verifyJWT }
