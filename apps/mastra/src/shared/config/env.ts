import { z } from 'zod'

const envServerSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  MAX_PAGES: z.number().default(1),
  MAX_DEPTH: z.number().default(1),
  MAX_DURATION_MS: z.number().default(5 * 60 * 1000), // 5 minutos
  DEEPSEEK_API_KEY: z.string().default('dummy-key'),
})

const mastraEnv = envServerSchema.parse(process.env)

export { mastraEnv }