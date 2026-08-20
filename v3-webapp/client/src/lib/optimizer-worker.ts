import { OptimizerWorkerController, installOptimizerWorkerScope, type OptimizerWorkerScopeLike } from "./optimizer-worker-controller";
import { BROWSER_WORKER_WALL_TIMEOUT_MS, createBrowserLocalSolverExecutor } from "./optimizer-worker-executor";

const scope = globalThis as unknown as OptimizerWorkerScopeLike;

if (typeof scope.addEventListener === "function" && typeof scope.postMessage === "function") {
  const controller = new OptimizerWorkerController(
    scope,
    createBrowserLocalSolverExecutor(),
    BROWSER_WORKER_WALL_TIMEOUT_MS,
  );
  installOptimizerWorkerScope(scope, controller);
}
