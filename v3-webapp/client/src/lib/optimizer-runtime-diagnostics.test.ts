import { describe, expect, it } from "vitest";

import {
  clearLocalOptimizerRuntimeDiagnosticsForTest,
  getLocalOptimizerRuntimeDiagnostics,
  recordOptimizerRuntimeDiagnostic,
} from "./optimizer-runtime-diagnostics";

describe("local optimizer runtime diagnostics", () => {
  it("retains only the latest twenty terminal status and elapsed-time entries in memory", () => {
    clearLocalOptimizerRuntimeDiagnosticsForTest();
    for (let index = 0; index < 21; index += 1) {
      recordOptimizerRuntimeDiagnostic({ status: "timeout", elapsedMs: index });
    }

    const entries = getLocalOptimizerRuntimeDiagnostics();
    expect(entries).toHaveLength(20);
    expect(entries[0]).toEqual({ status: "timeout", elapsedMs: 1 });
    expect(Object.keys(entries[0])).toEqual(["status", "elapsedMs"]);
  });
});
