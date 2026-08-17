const MAX_TITLE_LENGTH = 200;
const MAX_BODY_LENGTH = 5000;
const MAX_LABELS = 5;

const ALLOWED_REPORT_LABELS = new Set([
  "needs-research",
  "wrong-information",
  "wrong-info",
  "issue-report",
  "bird-request",
  "profile-request",
]);

function normalizedString(value, field, maxLength) {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} must not be empty.`);
  }
  if (normalized.length > maxLength) {
    throw new Error(`${field} exceeds its maximum length.`);
  }

  return normalized;
}

export function normalizeQueuedReport(report) {
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    throw new Error("Report payload must be an object.");
  }

  const title = normalizedString(report.title, "title", MAX_TITLE_LENGTH);
  const body = normalizedString(report.body, "body", MAX_BODY_LENGTH);
  const rawLabels = report.labels ?? ["needs-research"];

  if (!Array.isArray(rawLabels) || rawLabels.length > MAX_LABELS) {
    throw new Error("labels must be a list containing at most five values.");
  }

  const labels = [...new Set(rawLabels.filter(
    label => typeof label === "string" && ALLOWED_REPORT_LABELS.has(label)
  ))];

  return { title, body, labels: labels.length ? labels : ["needs-research"] };
}
