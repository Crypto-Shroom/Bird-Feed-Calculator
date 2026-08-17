import assert from "node:assert/strict";
import { parseIssueCreationResponse } from "../client/src/lib/issue-submission.ts";

const issue = parseIssueCreationResponse({
  ok: true,
  status: 201,
  contentType: "application/json; charset=utf-8",
  body: '{"html_url":"https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/99"}',
});
assert.equal(issue.html_url, "https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/99");

assert.throws(
  () => parseIssueCreationResponse({ ok: true, status: 200, contentType: "text/html; charset=utf-8", body: "<html>SPA fallback</html>" }),
  /did not return a GitHub issue response/,
  "Firebase Hosting HTML fallback must proceed to the Firestore queue",
);

assert.throws(
  () => parseIssueCreationResponse({ ok: true, status: 200, contentType: "application/json", body: "{}" }),
  /did not create a GitHub issue/,
  "JSON responses without a created issue URL must proceed to the Firestore queue",
);

assert.throws(
  () => parseIssueCreationResponse({ ok: false, status: 404, contentType: "application/json", body: '{"error":"Not found"}' }),
  /Server error \(404\)/,
);

console.log("Issue submission fallback checks passed.");
