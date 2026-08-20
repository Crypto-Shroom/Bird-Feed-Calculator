import type { OptimizerAdapterStatus } from "./optimizer-adapter";

export interface OptimizerRuntimeDiagnostic {
  status: OptimizerAdapterStatus;
  elapsedMs: number;
}

const maximumLocalDiagnostics = 20;
const localDiagnostics: OptimizerRuntimeDiagnostic[] = [];

/**
 * A bounded, in-memory runtime aid for development/support. It never records
 * inventory, bird/profile, formula, identifiers, timestamps, or any network
 * destination. Each retained entry contains only terminal status and elapsed time.
 */
export function recordOptimizerRuntimeDiagnostic(diagnostic: OptimizerRuntimeDiagnostic): void {
  localDiagnostics.push(diagnostic);
  if (localDiagnostics.length > maximumLocalDiagnostics) localDiagnostics.splice(0, localDiagnostics.length - maximumLocalDiagnostics);
}

export function getLocalOptimizerRuntimeDiagnostics(): readonly OptimizerRuntimeDiagnostic[] {
  return [...localDiagnostics];
}

export function clearLocalOptimizerRuntimeDiagnosticsForTest(): void {
  localDiagnostics.length = 0;
}
