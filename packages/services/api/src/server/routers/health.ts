import type { Elysia } from "elysia";

/**
 * Health check router
 */
export function healthRouter<T extends Elysia>(app: T) {
  return app.get("/", () => ({ status: "ok", timestamp: new Date().toISOString() }));
}
