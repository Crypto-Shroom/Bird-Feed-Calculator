import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createGitHubIssue } from "./github";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

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
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.API_PORT || process.env.PORT || 3001);

  server.listen(port, () => {
    console.log(`API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
