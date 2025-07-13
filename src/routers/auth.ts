import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      const hashed = await bcrypt.hash(input.password, 10)
      const user = await ctx.prisma.user.create({
        data: { ...input, password: hashed }
      })
      return {
        message: 'User created',
        user: { id: user.id, name: user.name, email: user.email }
      }
    }),

  login: publicProcedure
    .input(z.object({
      email: z.email(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } })
      if (!user) throw new Error('Invalid credentials')

      const valid = await bcrypt.compare(input.password, user.password)
      if (!valid) throw new Error('Invalid credentials')

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })

      return { token }
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.user
    })
})
