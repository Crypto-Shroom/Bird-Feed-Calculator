const PRIORITY_REPORT_LABELS = new Set(["wrong-information", "issue-report", "wrong-info"]);
const ENHANCEMENT_REPORT_LABELS = new Set(["bird-request", "profile-request"]);

/**
 * Preserve all caller-provided labels and add the repository's existing
 * category label exactly once. GitHub labels are case-insensitive, but we use
 * the repository's established spelling: `Priority` and `enhancement`.
 */
export function labelsForImportedReport(labels = []) {
  const existing = Array.isArray(labels) ? labels.filter(Boolean) : [];
  const normalized = new Set(existing.map((label) => label.toLowerCase()));
  const additions = [];

  if ([...normalized].some((label) => PRIORITY_REPORT_LABELS.has(label))) {
    if (!normalized.has("priority")) additions.push("Priority");
  }

  if ([...normalized].some((label) => ENHANCEMENT_REPORT_LABELS.has(label))) {
    if (!normalized.has("enhancement")) additions.push("enhancement");
  }

  return [...existing, ...additions];
}

export const REPORT_LABEL_RULES = Object.freeze({
  priority: [...PRIORITY_REPORT_LABELS],
  enhancement: [...ENHANCEMENT_REPORT_LABELS],
});
