import { BrowserClient } from "@project-template/browser";

import { env } from "../env";

export const browser = new BrowserClient({
  SERVER_URL: env.BROWSER_SERVER_URL,
});
