import { treaty } from "@project-template/server";

import type { APIServerSpec } from "./server/root";

/**
 * APIClient - Type-safe client for the API
 *
 * Uses Eden treaty for end-to-end type safety between client and server.
 */
export class APIClient {
  readonly client: ReturnType<typeof this.createTreaty>;

  constructor({ API_URL }: { API_URL: string }) {
    this.client = this.createTreaty(API_URL);
  }

  private createTreaty(API_URL: string) {
    return treaty<APIServerSpec>(API_URL);
  }
}
