# Bird Feed Calculator Workspace

This repository organizes the multi-bird web app, the legacy pigeon-only app placeholder, and the Python CLI calculator under a single, documented structure. The multi-bird experience runs on a Vite/React client with a separate Node/Express server; the Python tools live in their own package alongside shared documentation and research notes.

## Repository layout
- `pigeon-mix-web-multi-bird/` – Production-ready multi-bird web app with `client/` (Vite/React), `server/`, `shared/`, and built `dist/` assets. Static marketing images (`hero-pigeon-mix.png`, `ingredients-collage.png`, `pigeon-portrait.png`) are intentionally not tracked—drop them into `client/public/images/` before running.
- `pigeon-mix-web/` – Placeholder for the original pigeon-only web app; drop its source here alongside a README for that variant.
- `python-package/pigeon_mix_calculator/` – Python CLI package (standard and v2 calculators plus examples and tests).
- `docs/` – Centralized user guides, setup notes, research summaries, QA checklists, and implementation reports.
- `archives/` – (Optional, untracked) archived zip bundles from earlier iterations.

## Running the multi-bird web app
1. Install dependencies (pnpm recommended):
   ```bash
   cd pigeon-mix-web-multi-bird
   pnpm install
   ```
2. Start the dev server:
   ```bash
   pnpm dev
   ```
3. Build and run the bundled client/server for production:
   ```bash
   pnpm build
   pnpm start
   ```
   - The client lives in `client/` (Vite/React) and shares constants via `shared/`.
   - The server entry point is `server/index.ts`, bundled into `dist/` by the build script.

## Python CLI calculator
- Navigate to `python-package/pigeon_mix_calculator/` and run:
  ```bash
  python3 pigeon_mix_calculator.py
  ```
- For expanded ingredient coverage and herb/supplement suggestions, use:
  ```bash
  python3 pigeon_mix_calculator_v2.py
  ```
- Example input files live in `python-package/pigeon_mix_calculator/examples/`. More detailed CLI instructions are in `docs/python-cli/`.

## Documentation
- Guides and quick starts: `docs/guides/`, `docs/python-cli/`
- Research and nutrition references: `docs/research/`
- Project summaries and implementation notes: `docs/summaries/`, `docs/reports/`
- Design ideas and planning notes: `docs/design/`, `docs/notes/`, and QA checklists in `docs/qa/`

## License
This repository uses the **Non-Commercial Private Use License (NC-PUL-1.0)** located at `LICENSE`. Private and internal use is allowed; commercial use requires a separate license. See the license file for details and contact information.
