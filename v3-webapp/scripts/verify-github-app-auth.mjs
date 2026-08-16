import { verifyGitHubAppAuthentication } from "../server/github.ts";

await verifyGitHubAppAuthentication();
console.log("GitHub App authentication succeeded.");
