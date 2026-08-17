import { describe, expect, it } from "vitest";
import { labelsForImportedReport } from "./report-labels.mjs";

describe("labelsForImportedReport", () => {
  it("adds Priority to wrong-information reports while preserving labels", () => {
    expect(labelsForImportedReport(["wrong-information", "needs-research"])).toEqual([
      "wrong-information",
      "needs-research",
      "Priority",
    ]);
  });

  it("adds enhancement to bird and profile suggestions", () => {
    expect(labelsForImportedReport(["bird-request"])).toEqual(["bird-request", "enhancement"]);
    expect(labelsForImportedReport(["profile-request"])).toEqual(["profile-request", "enhancement"]);
  });

  it("adds both labels when a report carries both categories", () => {
    expect(labelsForImportedReport(["issue-report", "profile-request"])).toEqual([
      "issue-report",
      "profile-request",
      "Priority",
      "enhancement",
    ]);
  });

  it("does not duplicate labels or classify unknown reports", () => {
    expect(labelsForImportedReport(["Priority", "enhancement", "needs-research"])).toEqual([
      "Priority",
      "enhancement",
      "needs-research",
    ]);
    expect(labelsForImportedReport(["needs-research"])).toEqual(["needs-research"]);
  });
});
