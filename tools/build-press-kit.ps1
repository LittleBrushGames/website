param()

$ErrorActionPreference = 'Stop'

$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$assets = Join-Path $root 'assets'
$press = Join-Path $assets 'press'
$keyArt = Join-Path $press 'key-art'
$logos = Join-Path $press 'logos'
$studio = Join-Path $press 'studio'
$store = Join-Path $press 'store'
$phone = Join-Path $press 'screenshots\phone'
$tablet = Join-Path $press 'screenshots\tablet'
$previews = Join-Path $assets 'screenshots\current'
$downloads = Join-Path $assets 'downloads'
$source = Join-Path $assets 'source'
$brandRepo = (Resolve-Path -LiteralPath (Join-Path $root '..\TruthOrMole_Flutter')).Path

$magick = (Get-Command magick -ErrorAction Stop).Source
$landscapeSource = Join-Path $source 'truth-or-mole-unified-landscape-1536x1024.png'
$squareSource = Join-Path $source 'truth-or-mole-unified-square-1254.png'
$portraitSource = Join-Path $source 'truth-or-mole-unified-portrait-4x5-1122x1402.png'
$storySource = Join-Path $source 'truth-or-mole-unified-portrait-9x16-1024x1536.png'
$cleanSource = Join-Path $source 'truth-or-mole-unified-clean-landscape-1536x1024.png'
$feature = Join-Path $downloads 'truth-or-mole-feature-1024x500.png'
$icon = Join-Path $downloads 'truth-or-mole-icon-512.png'
$studioAvatar = Join-Path $brandRepo 'docs\marketing\social-registration-kit\shared\little-brush-games-avatar-1024.png'
$studioHeader = Join-Path $brandRepo 'docs\marketing\social-registration-kit\source\generated\youtube-banner-imagegen-v7-safe-zoomout-upscaled-4x.png'
$websiteStartScreenSource = Join-Path $brandRepo 'docs\marketing\website\runs\2026-08-19-product-screen-v2\raw\truth-or-mole_start-screen_en.png'
$localizedIdentity = Join-Path $brandRepo 'docs\marketing\social-media\runs\2026-08-23-localized-title-badge-v3\final'
$titleBadgeSource = Join-Path $localizedIdentity 'truth-or-mole_title-badge_1200.png'
$titleBadgeEnSource = Join-Path $localizedIdentity 'truth-or-mole_title-badge_en_1600.png'
$titleBadgeRuSource = Join-Path $localizedIdentity 'truth-or-mole_title-badge_ru_1600.png'
$productLockupSource = Join-Path $localizedIdentity 'truth-or-mole_product-lockup_horizontal_2000x900.png'
$productLockupEnSource = Join-Path $localizedIdentity 'truth-or-mole_product-lockup_horizontal_en_2000x900.png'
$productLockupRuSource = Join-Path $localizedIdentity 'truth-or-mole_product-lockup_horizontal_ru_2000x900.png'

foreach ($required in @($landscapeSource, $squareSource, $portraitSource, $storySource, $cleanSource, $feature, $icon, $studioAvatar, $studioHeader, $websiteStartScreenSource, $titleBadgeSource, $titleBadgeEnSource, $titleBadgeRuSource, $productLockupSource, $productLockupEnSource, $productLockupRuSource)) {
  if (-not (Test-Path -LiteralPath $required)) {
    throw "Missing press-kit source: $required"
  }
}

New-Item -ItemType Directory -Force -Path $keyArt, $logos, $studio, $store, $phone, $tablet, $previews, $downloads | Out-Null

Copy-Item -LiteralPath $titleBadgeSource -Destination (Join-Path $logos 'truth-or-mole_title-badge_1200.png') -Force
Copy-Item -LiteralPath $titleBadgeEnSource -Destination (Join-Path $logos 'truth-or-mole_title-badge_en_1600.png') -Force
Copy-Item -LiteralPath $titleBadgeRuSource -Destination (Join-Path $logos 'truth-or-mole_title-badge_ru_1600.png') -Force
Copy-Item -LiteralPath $productLockupSource -Destination (Join-Path $logos 'truth-or-mole_product-lockup_horizontal_2000x900.png') -Force
Copy-Item -LiteralPath $productLockupEnSource -Destination (Join-Path $logos 'truth-or-mole_product-lockup_horizontal_en_2000x900.png') -Force
Copy-Item -LiteralPath $productLockupRuSource -Destination (Join-Path $logos 'truth-or-mole_product-lockup_horizontal_ru_2000x900.png') -Force

$landscape = Join-Path $keyArt 'truth-or-mole_key-art_16x9_1920x1080.jpg'
& $magick $landscapeSource -crop '1536x864+0+80' +repage -filter Lanczos -resize '1920x1080!' -quality 93 $landscape
if ($LASTEXITCODE -ne 0) { throw 'Failed to render 16:9 key art.' }

$square = Join-Path $keyArt 'truth-or-mole_key-art_1x1_1080x1080.png'
& $magick $squareSource -filter Lanczos -resize '1080x1080!' $square
if ($LASTEXITCODE -ne 0) { throw 'Failed to render square key art.' }

$portrait = Join-Path $keyArt 'truth-or-mole_key-art_4x5_1080x1350.jpg'
& $magick $portraitSource -filter Lanczos -resize '1080x1350^' -gravity center -extent '1080x1350' -quality 93 $portrait
if ($LASTEXITCODE -ne 0) { throw 'Failed to render 4:5 key art.' }

$story = Join-Path $keyArt 'truth-or-mole_key-art_9x16_1080x1920.jpg'
& $magick $storySource -crop '864x1536+80+0' +repage -filter Lanczos -resize '1080x1920!' -quality 93 $story
if ($LASTEXITCODE -ne 0) { throw 'Failed to render 9:16 key art.' }

$clean = Join-Path $keyArt 'truth-or-mole_key-art_clean_1920x1080.png'
& $magick $cleanSource -crop '1536x864+0+80' +repage -filter Lanczos -resize '1920x1080!' $clean
if ($LASTEXITCODE -ne 0) { throw 'Failed to render clean 16:9 key art.' }

$studioHero = Join-Path $assets 'little-brush-games-studio-hero.webp'
& $magick $studioHeader -filter Lanczos -resize '2560x1440!' -quality 86 $studioHero
if ($LASTEXITCODE -ne 0) { throw 'Failed to render the studio website hero.' }

$studioHeroMobile = Join-Path $assets 'little-brush-games-studio-hero-mobile.webp'
& $magick $studioHeader -crop '3764x3764+1180+0' +repage -filter Lanczos -resize '1400x1400!' -quality 86 $studioHeroMobile
if ($LASTEXITCODE -ne 0) { throw 'Failed to render the mobile studio hero.' }

$studioPress = Join-Path $studio 'little-brush-games_studio-key-art_2560x1440.png'
& $magick $studioHeader -filter Lanczos -resize '2560x1440!' -depth 8 -define 'png:color-type=2' $studioPress
if ($LASTEXITCODE -ne 0) { throw 'Failed to render the studio press key art.' }

$studioOg = Join-Path $assets 'og-little-brush-games.jpg'
& $magick $studioHeader -resize '1200x630^' -gravity center -extent '1200x630' -quality 91 $studioOg
if ($LASTEXITCODE -ne 0) { throw 'Failed to render the studio social preview.' }

$websiteStartScreen = Join-Path $assets 'truth-or-mole-start-screen.webp'
& $magick $websiteStartScreenSource -filter Lanczos -resize '810x1800!' -quality 86 $websiteStartScreen
if ($LASTEXITCODE -ne 0) { throw 'Failed to render the Truth or Mole website start screen.' }

foreach ($deprecated in @(
  (Join-Path $logos 'truth-or-mole_title-lockup_transparent_1600.png'),
  (Join-Path $logos 'truth-or-mole_title-card_1200.png'),
  (Join-Path $keyArt 'truth-or-mole_key-art_clean_1672x941.png'),
  (Join-Path $logos 'little-brush-games_studio-logo_square_1254.png'),
  (Join-Path $logos 'little-brush-games_studio-mark.svg'),
  (Join-Path $assets 'truth-or-mole-spotlight.webp'),
  (Join-Path $assets 'truth-or-mole-spotlight-mobile.webp')
)) {
  if (Test-Path -LiteralPath $deprecated) { Remove-Item -LiteralPath $deprecated -Force }
}

Copy-Item -LiteralPath $feature -Destination (Join-Path $store 'truth-or-mole_google-play-feature_1024x500.png') -Force
Copy-Item -LiteralPath $icon -Destination (Join-Path $logos 'truth-or-mole_app-icon_512.png') -Force
Copy-Item -LiteralPath $studioAvatar -Destination (Join-Path $assets 'little-brush-games-logo.png') -Force
Copy-Item -LiteralPath $studioAvatar -Destination (Join-Path $logos 'little-brush-games_studio-avatar_1024.png') -Force

Get-ChildItem -LiteralPath $phone -Filter '*.png' | Sort-Object Name | ForEach-Object {
  $preview = Join-Path $previews ($_.BaseName + '.webp')
  & $magick $_.FullName -resize '540x960' -quality 80 $preview
  if ($LASTEXITCODE -ne 0) { throw "Failed to render preview: $($_.Name)" }
}

$socialPreview = Join-Path $assets 'og-truth-or-mole.jpg'
& $magick $landscape -resize '1200x630^' -gravity center -extent '1200x630' -quality 91 $socialPreview
if ($LASTEXITCODE -ne 0) { throw 'Failed to render social preview.' }

$screenshotsZip = Join-Path $downloads 'truth-or-mole_screenshots_phone-tablet_en-US.zip'
$completeZip = Join-Path $downloads 'truth-or-mole_press-kit_2026-08.zip'
$packageRoot = Join-Path ([IO.Path]::GetTempPath()) ('truth-or-mole-press-kit-' + [guid]::NewGuid())
try {
  $packageKeyArt = Join-Path $packageRoot 'KEY_ART'
  $packageLogos = Join-Path $packageRoot 'LOGOS'
  $packageStudio = Join-Path $packageRoot 'STUDIO'
  $packagePhone = Join-Path $packageRoot 'SCREENSHOTS_PHONE'
  $packageTablet = Join-Path $packageRoot 'SCREENSHOTS_TABLET'
  $packageStore = Join-Path $packageRoot 'STORE'
  New-Item -ItemType Directory -Force -Path $packageKeyArt, $packageLogos, $packageStudio, $packagePhone, $packageTablet, $packageStore | Out-Null
  Copy-Item -Path (Join-Path $keyArt '*') -Destination $packageKeyArt -Force
  Copy-Item -Path (Join-Path $logos '*') -Destination $packageLogos -Force
  Copy-Item -Path (Join-Path $studio '*') -Destination $packageStudio -Force
  Copy-Item -Path (Join-Path $phone '*') -Destination $packagePhone -Force
  Copy-Item -Path (Join-Path $tablet '*') -Destination $packageTablet -Force
  Copy-Item -Path (Join-Path $store '*') -Destination $packageStore -Force
  Copy-Item -LiteralPath (Join-Path $press 'README.txt') -Destination $packageRoot -Force

  Compress-Archive -LiteralPath $packagePhone, $packageTablet -DestinationPath $screenshotsZip -CompressionLevel Optimal -Force
  Compress-Archive -Path (Join-Path $packageRoot '*') -DestinationPath $completeZip -CompressionLevel Optimal -Force
}
finally {
  if (Test-Path -LiteralPath $packageRoot) {
    Remove-Item -LiteralPath $packageRoot -Recurse -Force
  }
}

Write-Host "Press kit built: $completeZip"
