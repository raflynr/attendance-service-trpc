import { router, publicProcedure } from '../trpc'

export const healthRouter = router({
   health: publicProcedure.query(() => 'health check'),
})