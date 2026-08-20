import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(import.meta.dirname, "../client"),
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "../client/src/lib/optimizer-worker.ts"),
      formats: ["es"],
      fileName: "optimizer-worker",
    },
    outDir: resolve(import.meta.dirname, "../../../worker-bundle-proof"),
  },
});
