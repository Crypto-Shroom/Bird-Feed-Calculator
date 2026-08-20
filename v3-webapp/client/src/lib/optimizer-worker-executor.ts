import highsLoader from "highs";
import highsWasmUrl from "highs/runtime?url";

import type { OptimizerModel } from "./optimizer-model";
import type { OptimizerWorkerExecutor, OptimizerWorkerExecutorResult } from "./optimizer-worker-controller";

export const BROWSER_SOLVER_TIME_LIMIT_MS = 500;
export const BROWSER_WORKER_WALL_TIMEOUT_MS = 1_000;

interface HighsColumn {
  Primal: number;
}

interface HighsSolution {
  Status: string;
  Columns: Record<string, HighsColumn | undefined>;
}

interface HighsSolver {
  solve(problem: string, options: {
    time_limit: number;
    threads: number;
    parallel: "off";
    output_flag: false;
    log_to_console: false;
  }): HighsSolution;
}

type HighsLoader = (options: { locateFile(file: string): string }) => Promise<HighsSolver>;

export interface BrowserSolverExecutorOptions {
  loadHighs?: HighsLoader;
  timeLimitMs?: number;
}

function mapSolutionStatus(status: string): OptimizerWorkerExecutorResult["status"] {
  if (status === "Optimal") return "optimal";
  if (status === "Infeasible") return "infeasible";
  if (status === "Time limit reached") return "timeout";
  return "error";
}

function quantitiesFromSolution(solution: HighsSolution, model: OptimizerModel): Record<string, number> {
  return Object.fromEntries(model.candidates.map(({ id }) => [id, solution.Columns[id]?.Primal ?? Number.NaN]));
}

/**
 * Creates an executor intended only for a dedicated browser Worker. The wasm
 * locator points to a Vite-managed local asset; it never calls Firebase or a
 * third-party solver endpoint. The HiGHS time limit is an in-solver bound,
 * while the controller retains the independent wall-clock cancellation guard.
 */
export function createBrowserLocalSolverExecutor(options: BrowserSolverExecutorOptions = {}): OptimizerWorkerExecutor {
  const timeLimitMs = options.timeLimitMs ?? BROWSER_SOLVER_TIME_LIMIT_MS;
  if (!Number.isFinite(timeLimitMs) || timeLimitMs <= 0) throw new Error("browser solver time limit must be positive and finite");

  const loadHighs: HighsLoader = options.loadHighs ?? ((settings) => highsLoader(settings) as Promise<HighsSolver>);
  let solverPromise: Promise<HighsSolver> | undefined;
  const getSolver = (): Promise<HighsSolver> => {
    solverPromise ??= loadHighs({
      locateFile: (file) => file.endsWith(".wasm") ? highsWasmUrl : file,
    });
    return solverPromise;
  };

  return async (request, context): Promise<OptimizerWorkerExecutorResult> => {
    if (context.isCancelled()) return { status: "cancelled", quantities: {}, errorMessage: "Optimizer solve was cancelled before execution" };

    const solver = await getSolver();
    if (context.isCancelled()) return { status: "cancelled", quantities: {}, errorMessage: "Optimizer solve was cancelled before execution" };

    const solution = solver.solve(request.model.lp, {
      time_limit: timeLimitMs / 1_000,
      threads: 1,
      parallel: "off",
      output_flag: false,
      log_to_console: false,
    });
    if (context.isCancelled()) return { status: "cancelled", quantities: {}, solverStatus: solution.Status, errorMessage: "Optimizer solve was cancelled" };

    const status = mapSolutionStatus(solution.Status);
    const quantities = status === "optimal" ? quantitiesFromSolution(solution, request.model) : {};
    return {
      status,
      quantities,
      solverStatus: solution.Status,
      ...(status === "error" ? { errorMessage: `HiGHS returned unsupported status '${solution.Status}'` } : {}),
    };
  };
}

