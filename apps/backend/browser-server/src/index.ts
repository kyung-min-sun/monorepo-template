import { BrowserServer } from "@project-template/browser/server";

import { browser } from "./clients/browser";
import { storage } from "./clients/storage";
import { env } from "./env";

/**
 * Browser Server Entry Point
 *
 * This app runs the browser automation service separately from the main API.
 * It's hoisted from the @project-template/browser package.
 *
 * Design Pattern:
 * 1. Service logic lives in packages/services/browser
 * 2. Client instantiation happens here in the app
 * 3. The server is initialized with injected services
 */
BrowserServer.initialize({
  services: { storage, browser },
  env: {
    NODE_ENV: env.NODE_ENV,
  },
}).listen(env.PORT);

console.log(`Browser server running on port ${env.PORT}`);
