import { createServer, type Server } from "node:http";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "./index";

let server: Server | undefined;

afterEach(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) => server?.close(error => error ? reject(error) : resolve()));
  }
  server = undefined;
});

async function startTestServer(requestLimit?: { limit: number; windowMs: number }) {
  server = createServer(createApp({
    staticPath: path.resolve(process.cwd(), "client"),
    requestLimit,
  }));
  await new Promise<void>((resolve, reject) => {
    server?.once("error", reject);
    server?.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not provide a TCP address.");
  }

  return `http://127.0.0.1:${address.port}`;
}

describe("Express server", () => {
  it("keeps malformed in-app report submissions on the validation path", async () => {
    const baseUrl = await startTestServer();

    const response = await fetch(`${baseUrl}/api/submit-issue`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Title and body are required." });
  });

  it("serves the single-page application fallback for nested calculator routes", async () => {
    const baseUrl = await startTestServer();

    const response = await fetch(`${baseUrl}/library/herbs`);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('<div id="root"></div>');
  });

  it("returns a silent 429 response after the configured request limit", async () => {
    const baseUrl = await startTestServer({ limit: 1, windowMs: 60_000 });

    expect((await fetch(`${baseUrl}/library/herbs`)).status).toBe(200);
    const limitedResponse = await fetch(`${baseUrl}/library/herbs`);

    expect(limitedResponse.status).toBe(429);
    await expect(limitedResponse.text()).resolves.toBe("");
  });
});
