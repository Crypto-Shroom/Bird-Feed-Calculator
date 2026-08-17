import express from "express";
import rateLimit, { type Options as RateLimitOptions } from "express-rate-limit";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createGitHubIssue } from "./github";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type AppOptions = {
  staticPath?: string;
  requestLimit?: Pick<RateLimitOptions, "limit" | "windowMs">;
};

export function createApp({
  staticPath: staticPathOverride,
  requestLimit: requestLimitOverride,
}: AppOptions = {}) {
  const app = express();
  const requestLimiter = rateLimit({
    windowMs: requestLimitOverride?.windowMs ?? 60_000,
    limit: requestLimitOverride?.limit ?? 120,
    legacyHeaders: false,
    standardHeaders: "draft-8",
    handler: (_req, res) => res.status(429).end(),
  });

  app.use(express.json());
  app.use(requestLimiter);

  // API endpoint for in-app issue submission
  app.post("/api/submit-issue", async (req, res) => {
    try {
      const { title, body, labels } = req.body;
      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required." });
      }
      const result = await createGitHubIssue(title, body, labels || []);
      return res.json({ success: true, html_url: result.html_url });
    } catch (error: any) {
      console.error("Failed to create GitHub issue:", error);
      return res.status(500).json({ error: error.message || "Failed to create issue" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath = staticPathOverride ?? (
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public")
  );

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  return app;
}

export async function startServer() {
  const app = createApp();
  const server = createServer(app);

  const port = Number(process.env.API_PORT || process.env.PORT || 3001);

  server.listen(port, () => {
    console.log(`API server running on http://localhost:${port}/`);
  });
}

if (!process.env.VITEST) {
  startServer().catch(console.error);
}
