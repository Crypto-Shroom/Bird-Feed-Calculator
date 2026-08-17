const RESEARCH_APPROVAL_LABEL = "APPROVED";
const IMPLEMENTATION_APPROVAL_LABEL = "second approval label";

function normalizeLabels(labels) {
  return new Set(
    (labels || [])
      .map((label) => (typeof label === "string" ? label : label?.name))
      .filter(Boolean)
      .map((label) => label.trim().toLowerCase()),
  );
}

export function getResearchApprovalState(labels) {
  const normalized = normalizeLabels(labels);
  const researchApproved = normalized.has(RESEARCH_APPROVAL_LABEL.toLowerCase());
  const implementationApproved = normalized.has(IMPLEMENTATION_APPROVAL_LABEL.toLowerCase());

  return {
    researchApproved,
    implementationApproved,
    mayPublishCitedResearch: researchApproved,
    mayCreateDraftPullRequest: researchApproved && implementationApproved,
  };
}

export function mayCreateDraftPullRequest(labels) {
  return getResearchApprovalState(labels).mayCreateDraftPullRequest;
}
