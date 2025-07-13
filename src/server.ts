import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { authRouter } from './routers/auth' 
import { healthRouter } from './routers/health' 
import { createContext } from './trpc'
import { router } from './trpc'

export const appRouter = router({
  auth: authRouter,
  health: healthRouter,
})

Bun.serve({
  port: 3000,
  fetch(req) {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter, 
      createContext,
    })
  },
})

console.log('🚀 tRPC server running at http://localhost:3000/trpc')