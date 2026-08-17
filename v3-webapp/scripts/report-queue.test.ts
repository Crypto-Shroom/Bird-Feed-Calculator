import { describe, expect, it } from "vitest";
import { normalizeQueuedReport } from "./report-queue.mjs";

describe("normalizeQueuedReport", () => {
  it("accepts a valid queue payload and preserves approved labels", () => {
    expect(normalizeQueuedReport({
      title: "  Add ingredient  ",
      body: "  Please research this safely.  ",
      labels: ["bird-request", "needs-research"],
    })).toEqual({
      title: "Add ingredient",
      body: "Please research this safely.",
      labels: ["bird-request", "needs-research"],
    });
  });

  it("defaults missing labels and removes labels outside the approved submission vocabulary", () => {
    expect(normalizeQueuedReport({
      title: "Report title",
      body: "Report body",
      labels: ["needs-research", "maintainer-only"],
    })).toEqual({
      title: "Report title",
      body: "Report body",
      labels: ["needs-research"],
    });
  });

  it("rejects malformed, empty, oversized, and over-labelled queue payloads", () => {
    expect(() => normalizeQueuedReport({ title: "", body: "Body" })).toThrow("title must not be empty");
    expect(() => normalizeQueuedReport({ title: "Title", body: "Body", labels: "needs-research" })).toThrow("labels must be a list");
    expect(() => normalizeQueuedReport({ title: "Title", body: "Body", labels: ["a", "b", "c", "d", "e", "f"] })).toThrow("labels must be a list");
    expect(() => normalizeQueuedReport({ title: "x".repeat(201), body: "Body" })).toThrow("title exceeds");
  });
});
