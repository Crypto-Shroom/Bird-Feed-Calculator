import { OptimizerWorkerController, installOptimizerWorkerScope, type OptimizerWorkerScopeLike } from "./optimizer-worker-controller";

const scope = globalThis as unknown as OptimizerWorkerScopeLike;

if (typeof scope.addEventListener === "function" && typeof scope.postMessage === "function") {
  const controller = new OptimizerWorkerController(
    scope,
    async () => ({
      status: "error",
      quantities: {},
      errorMessage: "The isolated optimizer worker lifecycle proof of concept has no registered solver executor.",
    }),
    1_000,
  );
  installOptimizerWorkerScope(scope, controller);
}
