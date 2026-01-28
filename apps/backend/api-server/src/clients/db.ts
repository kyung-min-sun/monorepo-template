import { DatabaseClient } from "@project-template/db";

import { env } from "../env";

export const db = new DatabaseClient({
  databaseUrl: env.DATABASE_URL,
  logLevels: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  connectionLimit: 100,
});
