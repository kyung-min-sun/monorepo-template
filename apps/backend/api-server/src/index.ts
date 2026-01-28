import { APIServer } from "@project-template/api/server";

import { browser } from "./clients/browser";
import { db } from "./clients/db";
import { storage } from "./clients/storage";
import { env } from "./env";

/**
 * API Server Entry Point
 *
 * This app demonstrates the "services in packages, hoisted to apps" pattern:
 *
 * 1. Service implementations live in packages/services/*
 *    - @project-template/db (Prisma database client)
 *    - @project-template/storage (Bun S3 client)
 *    - @project-template/browser (Puppeteer client)
 *    - @project-template/api (API router definitions)
 *
 * 2. Service clients are instantiated here with environment config
 *
 * 3. The APIServer from @project-template/api is initialized with services
 *
 * This separation allows:
 * - Reusing service logic across multiple apps
 * - Testing services independently
 * - Clear dependency injection
 * - Type-safe service contracts
 */
const server = APIServer.initialize({
  services: { db, storage, browser },
  env: {
    NODE_ENV: env.NODE_ENV,
    FRONTEND_URL: env.FRONTEND_URL,
    API_URL: env.API_URL,
  },
}).listen(env.PORT);

console.log(`API server running at http://${server.server?.hostname}:${server.server?.port}`);
