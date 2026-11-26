# Profile Design & SVG Pipeline (`ImNotJean01`)

Architecture and visual specification for the `ImNotJean01/ImNotJean01` GitHub profile repository.

## 1. Design Philosophy & Lineage

The profile combines two complementary foundations:

- **Local-Asset Profile Architecture (inspired by `anjennlical/anjennlical`)**:
  - Four root Markdown entry points (`README.md`, `README.en.md`, `README.static.md`, `README.en.static.md`) so visitors can switch language (`PT-BR` / `EN`) or disable animations at any time.
  - Self-contained, reproducibly generated local SVGs under `assets/profile/` with zero dependency on third-party badge or stats generators.
  - Clean, human-readable filenames (`<slug>.svg`) for buttons, stack cards, heroes, footers, and project covers.
- **"Abyss // Silk & Spirit" Visual System**:
  - Editorial dark aesthetic built around sharp rectilinear `0px` corners, `1px` hairlines (`#1c202e`), zero box-shadows, editorial serif headings, sans body copy, and uppercase tracked monospace telemetry.

## 2. Strict 7-Color Palette

Every generated `.svg` strictly enforces the 7-color "Abyss // Silk & Spirit" hex allowlist:

| Token | Hex | Role |
|---|---|---|
| `abyss` | `#090a10` | Outer backdrop, recessed telemetry frames, diamond cores |
| `surface` | `#10121a` | Elevated plates, link buttons, stack cards, preview header bars |
| `line` | `#1c202e` | `1px` rectilinear borders, section threads, radar rings, tracks |
| `soul` | `#ececef` | Primary display text, headings, active labels |
| `mist` | `#858b9c` | Secondary copy, metadata labels, subtitles |
| `silk` | `#d4b483` | Editorial gold accents, indices, diamond motifs, command lanes |
| `spirit` | `#7ce8ff` | Spectral cyan accents, active telemetry beacons, query/realtime rails |

Alpha transparency is expressed exclusively via SVG `opacity`, `fill-opacity`, `stroke-opacity`, and `stop-opacity` attributes rather than 8-digit hexes or CSS color functions.

## 3. Typography & Layout Geometry

- **Serif**: `'Cormorant Garamond', Georgia, 'Times New Roman', serif`
- **Sans**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
- **Mono**: `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

Asset dimensions:

| Asset Group | Count | Dimensions | Notes |
|---|---|---|---|
| Heroes | 8 | `960×356` (desktop), `440×360` (mobile) | PT/EN × Animated/Static, with 3 internal summary mini-islands |
| Experience & Education Islands | 4 | `960×220` | PT/EN × Animated/Static, 3 internal sub-islands |
| Beyond Code Islands | 4 | `960×228` | PT/EN × Animated/Static, 3 internal sub-islands + tags |
| Footers | 4 | `960×148` | PT/EN × Animated/Static |
| Link / Nav / Action Buttons | 24 | `W×44` (`32px` visual surface at `y=6..38`) | Motion-free |
| Project Covers (`01`–`05`) | 20 | `960×326` | PT/EN × Animated/Static, with internal specs & stack sub-islands |
| Stack Cards (4 domains) | 25 | `142×60` | Motion-free, uniform width for natural wrapping |

## 4. Determinism & LF Normalization

- `scripts/build-assets.mjs` generates SVG strings deterministically using `\n` (LF) line endings and no volatile timestamps.
- `.gitattributes` enforces `eol=lf` across `.svg`, `.md`, `.mjs`, and `.json` files so Windows `core.autocrlf=true` checkouts preserve identical SHA-256 digests.
- Stale `.svg` files from previous builds are pruned automatically before writing `assets/profile/manifest.json`.

## 5. Accessibility & Motion Safety

- Every SVG declares `xmlns="http://www.w3.org/2000/svg"`, explicit `width`, `height`, `viewBox`, `role="img"`, `aria-labelledby`, `<title>`, and `<desc>`.
- Animated SVGs use subtle CSS `@keyframes` guarded by `@media (prefers-reduced-motion: reduce)` (`animation: none !important; transition: none !important;`).
- Animated READMEs (`README.md`, `README.en.md`) use `<picture>` with `(prefers-reduced-motion: reduce) and (max-width: 600px)` ordered before `(prefers-reduced-motion: reduce)` and `(max-width: 600px)`.
- Static READMEs (`README.static.md`, `README.en.static.md`) and all `*-static*.svg`, `links/*.svg`, and `stack/*.svg` files contain zero `<style>`, `@keyframes`, or SMIL `<animate*>` elements.

## 6. Local Zero-Dependency Pipeline

Requires only Node.js (`>= 22.0.0`, tested on `v26.13.1`) with zero `dependencies` or `devDependencies`:

```sh
node scripts/build-assets.mjs
node scripts/build-static-readmes.mjs
node scripts/validate.mjs
```

Or via npm scripts:

```sh
npm run build
npm run validate
npm run check
```
