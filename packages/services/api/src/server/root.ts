import { cors } from "@elysiajs/cors";

import type { APIRouterParams } from "./_router";

import { APIRouter } from "./_router";
import { healthRouter } from "./routers/health";
import { usersRouter } from "./routers/users";

/**
 * APIServer - Main API server combining all routers
 *
 * Design Pattern:
 * 1. Services are defined as packages in packages/services/*
 * 2. Services are instantiated in the app (apps/backend/api-server)
 * 3. Services are injected here and available to all routes
 * 4. Routes are organized in modular routers under ./routers/
 */
export class APIServer {
  static initialize(params: APIRouterParams) {
    return APIRouter.initialize(params)
      .use(
        cors({
          origin: [params.env.FRONTEND_URL],
          credentials: true,
        }),
      )
      .group("/health", (app) => healthRouter(app))
      .group("/users", (app) => usersRouter(app));
  }
}

export type APIServerSpec = ReturnType<typeof APIServer.initialize>;
