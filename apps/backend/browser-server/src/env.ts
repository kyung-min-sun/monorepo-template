import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8001),

  // Storage configuration (S3-compatible)
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),

  // Browser configuration
  BROWSER_WS_ENDPOINT: z.string().optional(),
  BROWSER_EXECUTABLE_PATH: z.string().optional(),
});

export const env = envSchema.parse(process.env);
