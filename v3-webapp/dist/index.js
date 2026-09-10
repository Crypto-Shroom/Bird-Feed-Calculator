// server/index.ts
import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/github.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
var GITHUB_APP_ID = "4615644";
var GITHUB_INSTALLATION_ID = "154218058";
var REPO_OWNER = "Crypto-Shroom";
var REPO_NAME = "Bird-Feed-Calculator";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getPrivateKey() {
  if (process.env.GITHUB_APP_PRIVATE_KEY) {
    return process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");
  }
  const keyPaths = [
    path.resolve(__dirname, "github-app.pem"),
    path.resolve(__dirname, "..", "server", "github-app.pem"),
    path.resolve(process.cwd(), "server", "github-app.pem")
  ];
  const pemPath = keyPaths.find((candidate) => fs.existsSync(candidate));
  if (pemPath) return fs.readFileSync(pemPath, "utf8");
  throw new Error("GitHub App private key is not configured on this server.");
}
async function getInstallationAccessToken() {
  const privateKey = getPrivateKey();
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: GITHUB_APP_ID
  };
  const appJwt = jwt.sign(payload, privateKey, { algorithm: "RS256" });
  const res = await axios.post(
    `https://api.github.com/app/installations/${GITHUB_INSTALLATION_ID}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );
  return res.data.token;
}
async function createGitHubIssue(title, body, labels = []) {
  const token = await getInstallationAccessToken();
  const res = await axios.post(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      title,
      body,
      labels
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );
  return { html_url: res.data.html_url };
}

// server/index.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
function createApp({
  staticPath: staticPathOverride,
  requestLimit: requestLimitOverride
} = {}) {
  const app = express();
  const requestLimiter = rateLimit({
    windowMs: requestLimitOverride?.windowMs ?? 6e4,
    limit: requestLimitOverride?.limit ?? 120,
    legacyHeaders: false,
    standardHeaders: "draft-8",
    handler: (_req, res) => res.status(429).end()
  });
  app.use(express.json());
  app.use(requestLimiter);
  app.post("/api/submit-issue", async (req, res) => {
    try {
      const { title, body, labels } = req.body;
      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required." });
      }
      const result = await createGitHubIssue(title, body, labels || []);
      return res.json({ success: true, html_url: result.html_url });
    } catch (error) {
      console.error("Failed to create GitHub issue:", error);
      return res.status(500).json({ error: error.message || "Failed to create issue" });
    }
  });
  const staticPath = staticPathOverride ?? (process.env.NODE_ENV === "production" ? path2.resolve(__dirname2, "public") : path2.resolve(__dirname2, "..", "dist", "public"));
  app.use(express.static(staticPath));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path2.join(staticPath, "index.html"));
  });
  return app;
}
async function startServer() {
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
export {
  createApp,
  startServer
};
