import { describe, expect, it } from "vitest";
import { getResearchApprovalState, mayCreateDraftPullRequest } from "./research-approval.mjs";

describe("research approval gates", () => {
  it("does not authorize research or implementation from an unlabelled report", () => {
    expect(getResearchApprovalState([])).toEqual({
      researchApproved: false,
      implementationApproved: false,
      mayPublishCitedResearch: false,
      mayCreateDraftPullRequest: false,
    });
  });

  it("allows cited research after the first approval only", () => {
    const state = getResearchApprovalState(["needs-research", "APPROVED"]);
    expect(state.researchApproved).toBe(true);
    expect(state.mayPublishCitedResearch).toBe(true);
    expect(state.mayCreateDraftPullRequest).toBe(false);
  });

  it("requires both approvals before draft-PR automation", () => {
    expect(mayCreateDraftPullRequest(["APPROVED"])).toBe(false);
    expect(mayCreateDraftPullRequest(["second approval label"])).toBe(false);
    expect(mayCreateDraftPullRequest(["APPROVED", "second approval label"])).toBe(true);
  });

  it("accepts GitHub label objects and ignores unrelated labels", () => {
    expect(
      mayCreateDraftPullRequest([
        { name: "enhancement" },
        { name: "APPROVED" },
        { name: "SECOND APPROVAL LABEL" },
      ]),
    ).toBe(true);
  });
});
