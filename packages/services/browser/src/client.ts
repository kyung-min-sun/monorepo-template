import { treaty } from "@project-template/server";

import type { BrowserServerSpec } from "./server";

/**
 * BrowserClient - Type-safe client for the browser server
 *
 * Uses Eden treaty to communicate with the browser-server app.
 * This allows the main API to delegate browser operations to a separate service.
 */
export class BrowserClient {
  readonly client: ReturnType<typeof this.createTreaty>;

  constructor({ SERVER_URL }: { SERVER_URL: string }) {
    this.client = this.createTreaty(SERVER_URL);
  }

  private createTreaty(SERVER_URL: string) {
    return treaty<BrowserServerSpec>(SERVER_URL);
  }
}
