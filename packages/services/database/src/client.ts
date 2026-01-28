import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export interface DatabaseConfig {
  databaseUrl: string;
  logLevels?: ("error" | "warn" | "info" | "query")[];
  connectionLimit?: number;
}

export class DatabaseClient {
  public readonly client: PrismaClient;

  constructor({ databaseUrl, logLevels, connectionLimit }: DatabaseConfig) {
    const connectionString =
      connectionLimit !== undefined
        ? `${databaseUrl}${databaseUrl.includes("?") ? "&" : "?"}connection_limit=${connectionLimit}`
        : databaseUrl;

    const adapter = new PrismaPg({
      connectionString,
      idleTimeoutMillis: 30_000, // Close idle connections after 30s
    });

    this.client = new PrismaClient({
      log: logLevels,
      adapter,
    });
  }
}

export { PrismaClient };
