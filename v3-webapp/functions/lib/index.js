"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitIssue = void 0;
const https_1 = require("firebase-functions/v2/https");
const axios_1 = require("axios");
const jwt = require("jsonwebtoken");
const GITHUB_APP_ID = "4615644";
const GITHUB_INSTALLATION_ID = "154218058";
const REPO_OWNER = "Crypto-Shroom";
const REPO_NAME = "Bird-Feed-Calculator";
// Simple in-memory rate limiting map (IP -> timestamp)
const recentSubmissions = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
function getPrivateKey() {
    const secretKey = process.env.GITHUB_APP_PRIVATE_KEY;
    if (secretKey) {
        return secretKey.replace(/\\n/g, "\n");
    }
    throw new Error("GitHub App private key secret is not configured in Firebase.");
}
async function getInstallationAccessToken() {
    const privateKey = getPrivateKey();
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now - 60,
        exp: now + 600,
        iss: GITHUB_APP_ID,
    };
    const appJwt = jwt.sign(payload, privateKey, { algorithm: "RS256" });
    const res = await axios_1.default.post(`https://api.github.com/app/installations/${GITHUB_INSTALLATION_ID}/access_tokens`, {}, {
        headers: {
            Authorization: `Bearer ${appJwt}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    return res.data.token;
}
exports.submitIssue = (0, https_1.onRequest)({ secrets: ["GITHUB_APP_PRIVATE_KEY"] }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        const clientIp = req.headers["x-forwarded-for"] || req.ip || "unknown";
        const now = Date.now();
        const lastSubmission = recentSubmissions.get(clientIp);
        if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW_MS) {
            res.status(429).json({ error: "Too many submissions. Please wait a minute before submitting another report." });
            return;
        }
        const { title, body, labels, websiteUrl } = req.body || {};
        // Honeypot check: websiteUrl should be empty for genuine human users
        if (websiteUrl && typeof websiteUrl === "string" && websiteUrl.trim().length > 0) {
            res.status(400).json({ error: "Invalid submission." });
            return;
        }
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            res.status(400).json({ error: "A valid title is required." });
            return;
        }
        if (!body || typeof body !== "string" || body.trim().length === 0) {
            res.status(400).json({ error: "A valid description body is required." });
            return;
        }
        recentSubmissions.set(clientIp, now);
        const sanitizedTitle = title.trim().slice(0, 200);
        const sanitizedBody = body.trim().slice(0, 5000);
        const safeLabels = Array.isArray(labels)
            ? labels.slice(0, 5).map((l) => String(l).slice(0, 50))
            : [];
        const token = await getInstallationAccessToken();
        const githubRes = await axios_1.default.post(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
            title: sanitizedTitle,
            body: sanitizedBody,
            labels: safeLabels,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        res.json({ success: true, html_url: githubRes.data.html_url });
    }
    catch (error) {
        console.error("Failed to create GitHub issue via Cloud Function:", error);
        res.status(500).json({ error: error.message || "Failed to create issue" });
    }
});
//# sourceMappingURL=index.js.map