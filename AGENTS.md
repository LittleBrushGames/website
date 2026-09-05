# AGENTS.md

## Current website direction

The user approved replacing the public website with the Andy & Nata prototype on 2026-09-05. Andy & Nata is the public creator brand; Little Brush Games remains the publisher and legal company. The project-level `../AGENTS.md` owns current positioning. The older contract below predates that strategy; do not restore its solo-founder positioning or legacy social handles.

Keep the existing localized pages, campaign redirect, and download URLs working. Localized pages currently use `legacy-styles.css`; the English replacement uses `styles.css` and `script.js`.

## Brand Governance

- The canonical Little Brush Games brand contract lives at `../TruthOrMole_Flutter/docs/marketing/brand/little-brush-games-brand-contract.md`.
- Use the project skill at `../TruthOrMole_Flutter/.codex/skills/maintain-little-brush-games-brand/` for studio or product branding, logos, icons, key art, and cross-surface consistency.
- Read the contract before brand work. A change to brand architecture, a canonical asset, status, or usage rule must update the contract version, registry, superseded material, and decision log in the same task.
- Applying an existing canonical asset through crop, resize, compression, or placement does not require a contract version bump.
- `tools/build-press-kit.ps1` is the deterministic propagation path for approved press artwork; do not turn a derived website export into a new canonical source.
- Never publish or deploy brand changes without explicit user approval.
