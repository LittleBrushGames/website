# Andy & Nata website

Public Andy & Nata creator website, published by Little Brush Games at https://littlebrushgames.com/ through GitHub Pages (`main`, repository root). The approved replacement comes from `../andynata-site`.

## Current routes

- `/`: creator homepage and project cards.
- `/truth-or-mole/`, `/dungeon-generator/`, `/secret-pc-project/`: project pages.
- `/follow/`: official creator channels.
- `/truth-or-mole/press-kit/`: press resources; `/press-kit.html` redirects here.
- `/play/`: existing localized campaign redirect, with UTM/referrer handling preserved.
- `/de/` and `/ru/`: existing localized pages retained with `legacy-styles.css` and current creator social links.

The new pages use shared CSS, locally vendored GSAP 3.13.0, WOFF2 fonts, and native navigation fallbacks. Reduced motion uses opacity fades without spatial movement. Press downloads retain their stable URLs. Source images, prompt files, and prototype test artifacts are not copied into this release.

## Validation and maintenance

Run `python ../andynata-site/tools/check_release.py .` from this directory and `node --check script.js`. Use the prototype's `tools/menu-smoke.html` for repeatable animation tests. Git history preserves the previous release.

Brand positioning is Andy & Nata as the developer couple; Little Brush Games is the publisher/legal company. The older product-repository brand contract and archived guidance below predate this approved public-brand transition and must be reconciled at their source before using them for future studio branding decisions.

## Asset source of truth

Current screenshots, feature art, and the app icon are derived from the canonical assets in the Truth or Mole app repository:

```text
docs/marketing/google-play/runs/v0.1.34/upload/en-US/phone/
docs/marketing/google-play/feature-graphic-spot-liar-catch-mole-1024x500.png
docs/marketing/google-play/runs/v0.1.34-icon-2/upload/en-US/icon.png
docs/marketing/social-registration-kit/source/generated/youtube-banner-imagegen-v7-safe-zoomout-upscaled-4x.png
docs/marketing/website/runs/2026-08-19-product-screen-v2/raw/truth-or-mole_start-screen_en.png
```

Web copies are optimized for delivery. Press-kit downloads preserve the original PNG files. Refresh these copies when the canonical Google Play run changes; do not redraw the app UI for the website.

## Rebuild the press kit

The press kit keeps its source artwork under `assets/source/` and its original English phone/tablet screenshots under `assets/press/screenshots/`. With ImageMagick installed, rebuild all key-art ratios, previews, social artwork, and ZIP files with:

```powershell
.\tools\build-press-kit.ps1
```

The product key art is sourced from the approved unified brand run in `TruthOrMole_Flutter/docs/marketing/social-media/runs/2026-08-19-unified-brand-key-art-v2/`. The homepage product section uses a real current-build start-screen capture from `TruthOrMole_Flutter/docs/marketing/website/runs/2026-08-19-product-screen-v2/`; no generated product UI is used. Studio hero and press artwork come from the approved single-scene social header master in `TruthOrMole_Flutter/docs/marketing/social-registration-kit/source/generated/`. Rebuilds only crop, resize, compress, and package those reviewed masters. The green released app icon remains the small product mark; generated or reconstructed app UI must never be presented as gameplay.

## GitHub Pages

Use `Deploy from a branch`, branch `main`, folder `/root`.

The repository includes `CNAME` for:

```text
littlebrushgames.com
```

Legal documents live separately at <https://legal.littlebrushgames.com/>.
