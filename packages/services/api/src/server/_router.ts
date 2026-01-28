import type { DatabaseClient } from "@project-template/db";
import type { BrowserClient } from "@project-template/browser";
import type { RouterParams } from "@project-template/server";
import type { StorageClient } from "@project-template/storage";

import { Router } from "@project-template/server";

export class AuthenticationError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class AuthorizationError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

/**
 * Services available to all API routes
 */
export interface APIServices {
  db: DatabaseClient;
  storage: StorageClient;
  browser: BrowserClient;
}

/**
 * Environment variables available to all API routes
 */
export interface APIEnv {
  NODE_ENV: "development" | "production" | "test";
  FRONTEND_URL: string;
  API_URL: string;
}

export type APIRouterParams = RouterParams<APIServices, APIEnv> & {
  guard?: { enabled?: boolean };
};

/**
 * APIRouter - Base router with service injection
 *
 * This router pattern allows you to:
 * 1. Define services in a package (packages/services/*)
 * 2. Instantiate them in the app (apps/backend/api-server)
 * 3. Inject them into all routes via context
 */
export class APIRouter {
  static initialize({ ...params }: APIRouterParams) {
    const {
      services: { db, ...services },
      guard = { enabled: false },
      ...rest
    } = params;

    return Router.initialize({ ...params, idleTimeout: 30 }).derive(
      async ({ headers }) => {
        // Extract auth token from headers if needed
        const token = headers.authorization?.replace("Bearer ", "");

        if (!token && guard.enabled) {
          throw new AuthenticationError("Unauthenticated");
        }

        // Return all services and context to route handlers
        return {
          token,
          ...rest,
          ...services,
          db,
        };
      },
    );
  }
}
