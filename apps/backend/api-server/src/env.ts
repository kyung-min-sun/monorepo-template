import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),

  // URLs
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  API_URL: z.string().default("http://localhost:3001"),

  // Database
  DATABASE_URL: z.string(),

  // Storage (S3-compatible)
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),

  // Browser server
  BROWSER_SERVER_URL: z.string().default("http://localhost:8001"),
});

export const env = envSchema.parse(process.env);
