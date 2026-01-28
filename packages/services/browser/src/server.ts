import type { RouterParams } from "@project-template/server";
import type { StorageClient } from "@project-template/storage";
import type { Browser } from "puppeteer-core";

import { Router } from "@project-template/server";
import { z } from "zod";

export interface BrowserServerServices {
  storage: StorageClient;
  browser: Browser;
}

export interface BrowserServerEnv {
  NODE_ENV: "development" | "production" | "test";
}

export type BrowserServerParams = RouterParams<BrowserServerServices, BrowserServerEnv>;

/**
 * BrowserServer - Puppeteer-based browser automation server
 *
 * Design Pattern:
 * - Runs as a separate service from the main API
 * - Exposes endpoints for browser automation tasks (screenshots, PDF generation, scraping)
 * - The main API communicates via BrowserClient
 */
export class BrowserServer {
  static initialize(params: BrowserServerParams) {
    return Router.initialize(params)
      .post(
        "/screenshot",
        async ({ body: { url, viewport }, browser, storage }) => {
          const page = await browser.newPage();

          try {
            if (viewport) {
              await page.setViewport(viewport);
            }

            await page.goto(url, { waitUntil: "networkidle0" });
            const screenshot = await page.screenshot({ type: "png" });

            const key = await storage.save(screenshot as Buffer, "image/png");
            const screenshotUrl = await storage.getUrl(key);

            return { key, url: screenshotUrl };
          } finally {
            await page.close();
          }
        },
        {
          body: z.object({
            url: z.string().url(),
            viewport: z
              .object({
                width: z.number().default(1920),
                height: z.number().default(1080),
              })
              .optional(),
          }),
        },
      )
      .post(
        "/pdf",
        async ({ body: { html, options }, browser, storage }) => {
          const page = await browser.newPage();

          try {
            await page.setContent(html, { waitUntil: "networkidle0" });

            const pdf = await page.pdf({
              format: options?.format ?? "A4",
              printBackground: true,
              margin: options?.margin ?? {
                top: "0.5in",
                bottom: "0.5in",
                left: "0.5in",
                right: "0.5in",
              },
            });

            const key = await storage.save(pdf, "application/pdf");
            const pdfUrl = await storage.getUrl(key);

            return { key, url: pdfUrl };
          } finally {
            await page.close();
          }
        },
        {
          body: z.object({
            html: z.string(),
            options: z
              .object({
                format: z.enum(["A4", "Letter", "Legal"]).optional(),
                margin: z
                  .object({
                    top: z.string().optional(),
                    bottom: z.string().optional(),
                    left: z.string().optional(),
                    right: z.string().optional(),
                  })
                  .optional(),
              })
              .optional(),
          }),
        },
      )
      .post(
        "/scrape",
        async ({ body: { url, selector }, browser }) => {
          const page = await browser.newPage();

          try {
            await page.goto(url, { waitUntil: "networkidle0" });

            const content = selector
              ? await page.$eval(selector, (el) => el.textContent)
              : await page.content();

            return { content };
          } finally {
            await page.close();
          }
        },
        {
          body: z.object({
            url: z.string().url(),
            selector: z.string().optional(),
          }),
        },
      )
      .get("/health", () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
      }));
  }
}

export type BrowserServerSpec = ReturnType<typeof BrowserServer.initialize>;
