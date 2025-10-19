# Vidstack Player für REDAXO

Moderner Media-Player (Video & Audio) mit vollständiger [Vidstack.io](https://vidstack.io)-Unterstützung für REDAXO CMS.

## Features

✅ **Universelle Medienunterstützung** - Video UND Audio-Wiedergabe (nicht nur Video!)  
✅ **Moderne Fluent API** - Method-Chaining für sauberen, lesbaren Code  
✅ **Mehrere Plattformen** - Lokale Dateien, YouTube, Vimeo  
✅ **Untertitel & Captions** - Vollständige WebVTT-Track-Unterstützung  
✅ **Adaptive Qualität** - Mehrere Quellen für Qualitätswechsel  
✅ **Barrierefreiheit** - WCAG-konform mit ARIA-Labels  
✅ **FFmpeg-Integration** - Video-Infos und Tools im Backend-Mediapool  
✅ **CKE5-Integration** - Automatisches oEmbed-Parsing  
✅ **Cache-Busting** - Automatische Asset-Versionierung  
✅ **Performance** - Defer/Async-Script-Loading  

## Installation

```bash
# Via Composer (empfohlen)
composer require friendsofredaxo/vidstack

# Oder via REDAXO Installer
# Suche nach "Vidstack Player" im AddOn-Installer
```

## Schnellstart

### Einfaches Video

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\VidstackPlayer;

$player = (new VidstackPlayer('video.mp4'))
    ->title('Mein Video')
    ->poster('poster.jpg')
    ->attributes(['controls' => true]);

echo $player->render();
```

### Einfaches Audio

```php
$player = (new VidstackPlayer('audio.mp3'))
    ->title('Podcast Episode 1')
    ->attributes(['controls' => true]);

echo $player->render();
```

### YouTube-Video

```php
$player = (new VidstackPlayer('https://youtube.com/watch?v=dQw4w9WgXcQ'))
    ->title('Never Gonna Give You Up');

echo $player->render();
```

## Fluent API Referenz

### Kern-Methoden

```php
$player = (new VidstackPlayer('source.mp4'))
    ->title('Titel')                    // Titel setzen
    ->lang('de')                        // Sprache setzen (Standard: 'de')
    ->poster('poster.jpg', 'Alt-Text')  // Poster-Bild setzen
    ->aspectRatio('16/9')               // Seitenverhältnis setzen
    ->thumbnails('thumbs.vtt')          // Thumbnail-Track setzen
    ->attributes(['controls' => true])  // Mehrere Attribute setzen
    ->attr('muted', true)               // Einzelnes Attribut setzen
    ->render();                         // HTML generieren
```

### Untertitel & Captions

```php
$player->track(
    src: 'subtitles.vtt',
    label: 'Deutsch',
    srclang: 'de',
    kind: 'subtitles',  // subtitles|captions|descriptions|chapters|metadata
    default: true
);
```

### Mehrere Quellen (Adaptive Qualität)

```php
$player->multipleSources([
    ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
    ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],
    ['src' => 'video-480p.mp4', 'width' => 854, 'height' => 480, 'type' => 'video/mp4']
]);
```

## Frontend-Integration

### Assets einbinden

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\AssetHelper;
?>
<!DOCTYPE html>
<html>
<head>
    <?php echo AssetHelper::getCss(); ?>
</head>
<body>
    <!-- Dein Content -->
    
    <?php echo AssetHelper::getJs(defer: true); ?>
</body>
</html>
```

### Asset Helper Optionen

```php
// CSS mit benutzerdefinierten Attributen
echo AssetHelper::getCss(['media' => 'screen'], cachebuster: true);

// JS mit defer (empfohlen für Performance)
echo AssetHelper::getJs(defer: true);

// JS mit async (mit Vorsicht verwenden)
echo AssetHelper::getJs(async: true);

// Benutzerdefinierte Attribute
echo AssetHelper::getJs(
    defer: true,
    attributes: ['type' => 'module', 'crossorigin' => 'anonymous'],
    cachebuster: true
);

// Cache-Busting deaktivieren
echo AssetHelper::getCss(cachebuster: false);
```

## Erweiterte Beispiele

### Vollständiges Video-Setup

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\VidstackPlayer;

$player = (new VidstackPlayer('movie.mp4'))
    ->title('Mein Film')
    ->lang('de')
    ->poster('poster.jpg', 'Film-Poster')
    ->aspectRatio('16/9')
    ->thumbnails('thumbs.vtt')
    ->track('subtitles_de.vtt', 'Deutsch', 'de', 'subtitles', true)
    ->track('subtitles_en.vtt', 'English', 'en', 'subtitles')
    ->multipleSources([
        ['src' => 'movie-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
        ['src' => 'movie-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4']
    ])
    ->attributes([
        'controls' => true,
        'playsinline' => true,
        'preload' => 'metadata'
    ]);

echo $player->render();
```

### Podcast mit Kapiteln

```php
$podcast = (new VidstackPlayer('episode-01.mp3'))
    ->title('Episode 1: Der Einstieg')
    ->lang('de')
    ->poster('cover.jpg', 'Podcast-Cover')
    ->track('chapters.vtt', 'Kapitel', 'de', 'chapters', true)
    ->attributes(['controls' => true]);

echo $podcast->render();
```

## Utility-Klassen

### Plattform-Erkennung

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\PlatformDetector;

// Plattform erkennen
$info = PlatformDetector::detect('https://youtube.com/watch?v=abc');
// Gibt zurück: ['platform' => 'youtube', 'id' => 'abc']

// Prüfen ob Audio
$isAudio = PlatformDetector::isAudio('podcast.mp3'); // true

// Prüfen ob gültiges Medium
$isMedia = PlatformDetector::isMedia('video.mp4'); // true
```

### Utilities

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\Utilities;

// HTML-Attribute erstellen
$attrs = Utilities::buildHtmlAttributes([
    'controls' => true,
    'muted' => true,
    'data-id' => '123'
]);
// Gibt zurück: ' controls muted data-id="123"'

// MIME-Type erkennen
$mime = Utilities::detectMimeType('video.webm'); // 'video/webm'
```

## Backend-Features

### Mediapool-Integration

Das AddOn integriert sich automatisch in den REDAXO-Mediapool:

- **Vorschau-Player** - Video/Audio-Vorschau in der Medien-Detail-Sidebar
- **Video-Info** - Auflösung, Codec, Dauer, Dateigröße, Bitrate (benötigt FFmpeg-AddOn)
- **Schnell-Tools** - Trimmen, Optimieren und Analysieren von Videos (benötigt FFmpeg-AddOn)

### FFmpeg-Integration

Installiere das [FFmpeg AddOn](https://github.com/FriendsOfREDAXO/ffmpeg) für erweiterte Features:

```bash
composer require friendsofredaxo/ffmpeg
```

Features mit FFmpeg:
- Video-Informationsanzeige
- Schnell-Trimm-Tool
- Optimierungs-Tool
- Detaillierte Video-Analyse

### CKE5-Integration

Das AddOn bietet einen oEmbed-Parser, um CKEditor 5 oEmbed-Tags in Vidstack-Player umzuwandeln.

**Manuelle Aktivierung erforderlich** (z.B. in der `boot.php` deines Projekt-AddOns):

```php
<?php
// In der boot.php deines Projekt-AddOns
use FriendsOfRedaxo\VidstackPlayer\OembedParser;

// oEmbed-Parser für CKE5 registrieren
OembedParser::register();
```

**So funktioniert es:**

```html
<!-- CKE5 fügt ein: -->
<oembed url="https://youtube.com/watch?v=abc"></oembed>

<!-- Wird konvertiert zu: -->
<media-player src="..." title="...">...</media-player>
```

**Warum manuelle Aktivierung?**
- Gibt dir volle Kontrolle über wann und wie Videos eingebettet werden
- Verhindert Konflikte mit bestehenden oEmbed-Handlern oder eigenen Implementierungen
- Opt-in-Ansatz - aktiviere nur wenn du es brauchst

## Architektur

Das AddOn ist in fokussierte, zweckgebundene Klassen strukturiert:

```
lib/
├── VidstackPlayer.php        # Haupt-Player-Klasse (Fluent API)
├── PlatformDetector.php      # Plattform- & Medientyp-Erkennung
├── AssetHelper.php           # CSS/JS-Laden mit Cache-Busting
├── Utilities.php             # HTML-Attribute, MIME-Types
├── Translator.php            # i18n-Übersetzungs-Helper
├── OembedParser.php          # CKE5 oEmbed-Integration
└── BackendIntegration.php    # Mediapool-Sidebar & FFmpeg
```

**Kernprinzipien:**
- ✅ Single Responsibility - Jede Klasse hat einen klaren Zweck
- ✅ Keine "God Classes" - Getrennte Zuständigkeiten
- ✅ Universelle Benennung - Nicht nur "Video", sondern "VidstackPlayer" (unterstützt auch Audio!)

## Consent Management

**Wichtig:** Dieses AddOn enthält KEIN Consent-Management für YouTube/Vimeo.

Für DSGVO-konforme Embeds installiere den [Consent Manager](https://github.com/FriendsOfREDAXO/consent_manager):

```bash
composer require friendsofredaxo/consent_manager
```

Der Consent Manager übernimmt automatisch die Einwilligung für YouTube- und Vimeo-Embeds.

## Browser-Unterstützung

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Für ältere Browser degradiert Vidstack elegant zu nativen Video/Audio-Elementen.

## Migration von Vidstack 1.x

Siehe [MIGRATION.md](MIGRATION.md) für detaillierte Migrations-Anweisungen.

**Breaking Changes:**
- Package-Name: `vidstack` → `vidstack`
- Namespace: `FriendsOfRedaxo\VidStack\Video` → `FriendsOfRedaxo\VidstackPlayer\VidstackPlayer`
- Klassen-Name: `Video` → `VidstackPlayer` (reflektiert Audio-Unterstützung)
- API: Setter-Methoden → Fluent Method Chaining
- Assets: Nutze `AssetHelper::getCss()` und `getJs()` statt manueller Einbindung

## Entwicklung

Dieses AddOn nutzt die [Standard GitHub Workflows für REDAXO AddOns](https://github.com/FriendsOfREDAXO/github-workflows).

### Setup

```bash
# Das AddOn muss im REDAXO-Kontext entwickelt werden
# Klone REDAXO und installiere das AddOn dort

# Node-Dependencies installieren
cd redaxo/src/addons/vidstack/build
npm install
```

### Lokale Quality Checks

**PHP** (im Docker Container oder REDAXO-Root):
```bash
# Im REDAXO Docker Container (empfohlen)
docker exec coreweb bash -c "cd /var/www/html/public && \
  vendor/bin/php-cs-fixer fix redaxo/src/addons/vidstack --config=redaxo/src/addons/vidstack/.php-cs-fixer.dist.php"

docker exec coreweb bash -c "cd /var/www/html/public && \
  php redaxo/src/addons/vidstack/.tools/rexstan.php && \
  redaxo/bin/console rexstan:analyze"
```

**JavaScript:**
```bash
cd build
npm run build              # Assets bauen
npx eslint config/*.js     # JavaScript linten  
npx eslint config/*.js --fix  # JavaScript auto-fixen
```

### GitHub Actions

Automatisch bei jedem Push/PR:

1. **Code Style** - PHP-CS-Fixer formatiert Code automatisch
2. **Rexstan** - PHPStan für REDAXO (Level 9)
3. **Build Assets** - ESLint + npm build
4. **Publish to REDAXO** - Bei GitHub Release

[Mehr Infos zu den Workflows](https://github.com/FriendsOfREDAXO/github-workflows)

## Lizenz

MIT License - Siehe [LICENSE](LICENSE)-Datei

## Credits

- Entwickelt mit [Vidstack](https://vidstack.io)
- Maintained by [Friends Of REDAXO](https://github.com/FriendsOfREDAXO)
- Für REDAXO CMS

## Support

- **Issues:** [GitHub Issues](https://github.com/FriendsOfREDAXO/vidstack/issues)
- **REDAXO Slack:** #addons Channel
- **Forum:** [REDAXO Forum](https://www.redaxo.org/forum/)
