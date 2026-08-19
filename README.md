# Little Brush Games website

Static product and studio website for **Little Brush Games** and **Truth or Mole**. Built as plain HTML/CSS for GitHub Pages. The visual system mirrors the current detective/case-board game UI and uses current Google Play artwork rather than reconstructed interface mockups.

Key routes:

- `/`, `/de/`, `/ru/` — localized studio-first homepages with Truth or Mole as the first released game.
- `/play/` — stable campaign link that preserves UTM values in the Google Play Install Referrer. Use `?lang=en`, `?lang=de`, or `?lang=ru` to set its interface language explicitly.
- `/press-kit.html`, `/de/press-kit.html`, `/ru/press-kit.html` — localized verified facts, approved copy, and downloadable media assets.

## Local preview

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765>.

Append `?no_redirect=1` to `/play/` when testing the route on Android without leaving the local page.

## Localization

English is the source copy. Keep the homepage and press-kit structure synchronized across `en`, `de`, and `ru`, including reciprocal `hreflang` links and sitemap entries. Studio and product names, plus the canonical slogan `Playful games. Better together.`, remain untranslated.

The `/play/` route uses an explicit `lang` query first, then the browser language, with English as the fallback. Legal pages are maintained separately in the `LittleBrushGames/legal` repository and should not be translated as ordinary marketing copy.

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
