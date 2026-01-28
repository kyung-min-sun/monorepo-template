import { logger } from "@bogeychan/elysia-logger";
import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";

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

export interface RouterParams<T, K> {
  services: T;
  env: K;
  router?: Elysia;
  idleTimeout?: number;
}

export class Router {
  static initialize<T, K>({
    router,
    services,
    env,
    idleTimeout = 60,
    ...rest
  }: RouterParams<T, K>) {
    return (router ?? new Elysia({ serve: { idleTimeout } }))
      .use(logger())
      .error({ AuthenticationError })
      .error({ AuthorizationError })
      .onError(({ code, set }) => {
        switch (code) {
          case "AuthenticationError":
            set.status = 401;
            return null;
          case "AuthorizationError":
            set.status = 403;
            return null;
        }
      })
      .derive(() => {
        return {
          ...rest,
          ...services,
          env,
        };
      });
  }
}

export { treaty };
