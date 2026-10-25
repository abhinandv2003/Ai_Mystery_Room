import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// The server is launched from its own package directory by npm --prefix.
// Resolve the shared env file from this module so startup is independent of cwd.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
dotenv.config({ path: resolve(projectRoot, '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  API_BASE_PATH: z.string().regex(/^\/[a-zA-Z0-9/_-]*$/).default('/api/v1'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().optional().default(''),
  MYSTERY_GENERATION_TIMEOUT_MS: z.coerce.number().int().positive().default(90000),
  MYSTERY_GENERATION_MAX_RETRIES: z.coerce.number().int().min(0).max(10).default(2),
  MYSTERY_GENERATION_MAX_CONCURRENCY: z.coerce.number().int().positive().default(2),
  SESSION_SECRET: z.string().optional().default(''),
  SESSION_TTL_HOURS: z.coerce.number().positive().default(24),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  IMAGE_GENERATION_PROVIDER: z.string().default('local'),
  IMAGE_GENERATION_API_KEY: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
  throw new Error(`Invalid server configuration:\n${details}\nSet the values in the repository root .env file.`);
}

export const env = Object.freeze(parsed.data);
