import highsLoader from "highs";
import highsWasmUrl from "highs/runtime?url";

import { BROWSER_SOLVER_TIME_LIMIT_MS } from "./optimizer-policy";
import { createSerialSolverExecutor, type HighsSolverLike } from "./optimizer-serial-solver";
import type { OptimizerWorkerExecutor } from "./optimizer-worker-controller";

// Defined in the Node-safe policy module so the comparison harness uses the same budget.
export { BROWSER_SOLVER_TIME_LIMIT_MS, BROWSER_WORKER_WALL_TIMEOUT_MS } from "./optimizer-policy";

type HighsLoader = (options: { locateFile(file: string): string }) => Promise<HighsSolverLike>;

export interface BrowserSolverExecutorOptions {
  loadHighs?: HighsLoader;
  timeLimitMs?: number;
  now?: () => number;
}

/**
 * Creates an executor intended only for a dedicated browser Worker. The wasm
 * locator points to a Vite-managed local asset; it never calls Firebase or a
 * third-party solver endpoint. The executor runs the full serial stage
 * sequence (see optimizer-serial-solver.ts) within one shared HiGHS time
 * budget, while the controller retains the independent wall-clock guard.
 */
export function createBrowserLocalSolverExecutor(options: BrowserSolverExecutorOptions = {}): OptimizerWorkerExecutor {
  const loadHighs: HighsLoader = options.loadHighs ?? ((settings) => highsLoader(settings) as Promise<HighsSolverLike>);
  return createSerialSolverExecutor({
    timeLimitMs: options.timeLimitMs ?? BROWSER_SOLVER_TIME_LIMIT_MS,
    now: options.now,
    loadSolver: () => loadHighs({
      locateFile: (file) => file.endsWith(".wasm") ? highsWasmUrl : file,
    }),
  });
}
