export type IssueCreationResponse = {
  html_url: string;
};

type HttpResponseMetadata = {
  ok: boolean;
  status: number;
  contentType: string | null;
  body: string;
};

/**
 * Accept only a real JSON response containing a GitHub issue URL. Firebase
 * Hosting serves the SPA document with HTTP 200 for unavailable `/api/*`
 * paths, which must fall through to the Firestore review queue instead.
 */
export function parseIssueCreationResponse({ ok, status, contentType, body }: HttpResponseMetadata): IssueCreationResponse {
  if (!ok) throw new Error(`Server error (${status})`);
  if (!contentType?.toLowerCase().includes("application/json")) {
    throw new Error("The in-app reporting service did not return a GitHub issue response.");
  }

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error("The in-app reporting service returned invalid JSON.");
  }

  if (!data || typeof data !== "object" || typeof (data as { html_url?: unknown }).html_url !== "string") {
    throw new Error("The in-app reporting service did not create a GitHub issue.");
  }

  return data as IssueCreationResponse;
}
