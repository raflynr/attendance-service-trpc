import { initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import jwt from 'jsonwebtoken'
import { prisma } from './db'
import { JWT_SECRET } from './config'

export const createContext = ({ req }: FetchCreateContextFnOptions) => {
  const token = req.headers.get('authorization')?.split(' ')[1]
  let user = null

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch {}
  }

  return { user, prisma }
}

const t = initTRPC.context<typeof createContext>().create()
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new Error('UNAUTHORIZED')
  return next({ ctx })
})
