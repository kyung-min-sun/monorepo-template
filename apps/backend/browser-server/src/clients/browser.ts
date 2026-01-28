import puppeteer from "puppeteer-core";

import { env } from "../env";

/**
 * Initialize the Puppeteer browser instance
 *
 * Supports two modes:
 * 1. Connect to existing browser via WebSocket (BROWSER_WS_ENDPOINT)
 * 2. Launch local browser (BROWSER_EXECUTABLE_PATH)
 */
async function initBrowser() {
  if (env.BROWSER_WS_ENDPOINT) {
    // Connect to an existing browser instance (e.g., browserless.io, docker)
    return puppeteer.connect({
      browserWSEndpoint: env.BROWSER_WS_ENDPOINT,
    });
  }

  if (env.BROWSER_EXECUTABLE_PATH) {
    // Launch a local browser
    return puppeteer.launch({
      executablePath: env.BROWSER_EXECUTABLE_PATH,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  throw new Error(
    "Either BROWSER_WS_ENDPOINT or BROWSER_EXECUTABLE_PATH must be set",
  );
}

export const browser = await initBrowser();

// Graceful shutdown
process.on("SIGINT", async () => {
  await browser.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await browser.close();
  process.exit(0);
});
