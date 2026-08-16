import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import jwt from "jsonwebtoken";

const GITHUB_APP_ID = "4615644";
const GITHUB_INSTALLATION_ID = "154218058";
const REPO_OWNER = "Crypto-Shroom";
const REPO_NAME = "Bird-Feed-Calculator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPrivateKey(): string {
  if (process.env.GITHUB_APP_PRIVATE_KEY) {
    return process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");
  }

  const keyPaths = [
    path.resolve(__dirname, "github-app.pem"),
    path.resolve(__dirname, "..", "server", "github-app.pem"),
    path.resolve(process.cwd(), "server", "github-app.pem"),
  ];

  const pemPath = keyPaths.find((candidate) => fs.existsSync(candidate));
  if (pemPath) return fs.readFileSync(pemPath, "utf8");

  throw new Error("GitHub App private key is not configured on this server.");
}

async function getInstallationAccessToken(): Promise<string> {
  const privateKey = getPrivateKey();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: GITHUB_APP_ID,
  };

  const appJwt = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  const res = await axios.post(
    `https://api.github.com/app/installations/${GITHUB_INSTALLATION_ID}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return res.data.token;
}

export async function verifyGitHubAppAuthentication(): Promise<void> {
  await getInstallationAccessToken();
}

export async function createGitHubIssue(title: string, body: string, labels: string[] = []): Promise<{ html_url: string }> {
  const token = await getInstallationAccessToken();
  const res = await axios.post(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      title,
      body,
      labels,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  return { html_url: res.data.html_url };
}
