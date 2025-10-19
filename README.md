# Vidstack Player for REDAXO

Modern media player (video & audio) addon with full [Vidstack.io](https://vidstack.io) support for REDAXO CMS.

## Features

✅ **Universal Media Support** - Video AND audio playback (not just video!)  
✅ **Modern Fluent API** - Method chaining for clean, readable code  
✅ **Multiple Platforms** - Local files, YouTube, Vimeo  
✅ **Subtitles & Captions** - Full WebVTT track support  
✅ **Adaptive Quality** - Multiple source support for quality switching  
✅ **Accessibility** - WCAG compliant with ARIA labels  
✅ **FFmpeg Integration** - Video info and tools in backend mediapool  
✅ **CKE5 Integration** - Automatic oEmbed parsing  
✅ **Cache-Busting** - Automatic asset versioning  
✅ **Performance** - Defer/async script loading  

## Installation

```bash
# Via Composer (recommended)
composer require friendsofredaxo/vidstack

# Or via REDAXO Installer
# Search for "Vidstack Player" in the addon installer
```

## Quick Start

### Basic Video

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\VidstackPlayer;

$player = (new VidstackPlayer('video.mp4'))
    ->title('My Video')
    ->poster('poster.jpg')
    ->attributes(['controls' => true]);

echo $player->render();
```

### Basic Audio

```php
$player = (new VidstackPlayer('audio.mp3'))
    ->title('Podcast Episode 1')
    ->attributes(['controls' => true]);

echo $player->render();
```

### YouTube Video

```php
$player = (new VidstackPlayer('https://youtube.com/watch?v=dQw4w9WgXcQ'))
    ->title('Never Gonna Give You Up');

echo $player->render();
```

## Fluent API Reference

### Core Methods

```php
$player = (new VidstackPlayer('source.mp4'))
    ->title('Title')                    // Set player title
    ->lang('de')                        // Set language (default: 'de')
    ->poster('poster.jpg', 'Alt text')  // Set poster image
    ->aspectRatio('16/9')               // Set aspect ratio
    ->thumbnails('thumbs.vtt')          // Set thumbnail track
    ->attributes(['controls' => true])  // Set multiple attributes
    ->attr('muted', true)               // Set single attribute
    ->render();                         // Generate HTML
```

### Subtitles & Captions

```php
$player->track(
    src: 'subtitles.vtt',
    label: 'Deutsch',
    srclang: 'de',
    kind: 'subtitles',  // subtitles|captions|descriptions|chapters|metadata
    default: true
);
```

### Multiple Sources (Adaptive Quality)

```php
$player->multipleSources([
    ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
    ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],
    ['src' => 'video-480p.mp4', 'width' => 854, 'height' => 480, 'type' => 'video/mp4']
]);
```

## Frontend Integration

### Include Assets

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
    <!-- Your content -->
    
    <?php echo AssetHelper::getJs(defer: true); ?>
</body>
</html>
```

### Asset Helper Options

```php
// CSS with custom attributes
echo AssetHelper::getCss(['media' => 'screen'], cachebuster: true);

// JS with defer (recommended for performance)
echo AssetHelper::getJs(defer: true);

// JS with async (use with caution)
echo AssetHelper::getJs(async: true);

// Custom attributes
echo AssetHelper::getJs(
    defer: true,
    attributes: ['type' => 'module', 'crossorigin' => 'anonymous'],
    cachebuster: true
);

// Disable cache-busting
echo AssetHelper::getCss(cachebuster: false);
```

## Advanced Examples

### Complete Video Setup

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\VidstackPlayer;

$player = (new VidstackPlayer('movie.mp4'))
    ->title('My Movie')
    ->lang('de')
    ->poster('poster.jpg', 'Movie poster')
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

### Podcast with Chapters

```php
$podcast = (new VidstackPlayer('episode-01.mp3'))
    ->title('Episode 1: Getting Started')
    ->lang('en')
    ->poster('cover.jpg', 'Podcast cover')
    ->track('chapters.vtt', 'Chapters', 'en', 'chapters', true)
    ->attributes(['controls' => true]);

echo $podcast->render();
```

## Utility Classes

### Platform Detection

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\PlatformDetector;

// Detect platform
$info = PlatformDetector::detect('https://youtube.com/watch?v=abc');
// Returns: ['platform' => 'youtube', 'id' => 'abc']

// Check if audio
$isAudio = PlatformDetector::isAudio('podcast.mp3'); // true

// Check if valid media
$isMedia = PlatformDetector::isMedia('video.mp4'); // true
```

### Utilities

```php
<?php
use FriendsOfRedaxo\VidstackPlayer\Utilities;

// Build HTML attributes
$attrs = Utilities::buildHtmlAttributes([
    'controls' => true,
    'muted' => true,
    'data-id' => '123'
]);
// Returns: ' controls muted data-id="123"'

// Detect MIME type
$mime = Utilities::detectMimeType('video.webm'); // 'video/webm'
```

## Backend Features

### Mediapool Integration

The addon automatically integrates into the REDAXO mediapool:

- **Preview Player** - Video/audio preview in media detail sidebar
- **Video Info** - Resolution, codec, duration, filesize, bitrate (requires FFmpeg addon)
- **Quick Tools** - Trim, optimize, and analyze videos (requires FFmpeg addon)

### FFmpeg Integration

Install the [FFmpeg AddOn](https://github.com/FriendsOfREDAXO/ffmpeg) for enhanced features:

```bash
composer require friendsofredaxo/ffmpeg
```

Features with FFmpeg:
- Video information display
- Quick trim tool
- Optimization tool
- Detailed video analysis

### CKE5 Integration

The addon provides an oEmbed parser to convert CKEditor 5 oEmbed tags to Vidstack players.

**Manual activation required** (e.g., in your project addon's `boot.php`):

```php
<?php
// In your project addon's boot.php
use FriendsOfRedaxo\VidstackPlayer\OembedParser;

// Register oEmbed parser for CKE5
OembedParser::register();
```

**How it works:**

```html
<!-- CKE5 inserts: -->
<oembed url="https://youtube.com/watch?v=abc"></oembed>

<!-- Gets converted to: -->
<media-player src="..." title="...">...</media-player>
```

**Why manual activation?**
- Gives you full control over when and how videos are embedded
- Prevents conflicts with existing oEmbed handlers or custom implementations
- Opt-in approach - activate only if you need it

## Architecture

The addon is structured into focused, single-purpose classes:

```
lib/
├── VidstackPlayer.php        # Main player class (fluent API)
├── PlatformDetector.php      # Platform & media type detection
├── AssetHelper.php           # CSS/JS loading with cache-busting
├── Utilities.php             # HTML attributes, MIME types
├── Translator.php            # i18n translation helper
├── OembedParser.php          # CKE5 oEmbed integration
└── BackendIntegration.php    # Mediapool sidebar & FFmpeg
```

**Key Principles:**
- ✅ Single Responsibility - Each class has one clear purpose
- ✅ No "God Classes" - Separated concerns
- ✅ Universal naming - Not just "Video", but "VidstackPlayer" (supports audio too!)

## Consent Management

**Important:** This addon does NOT include consent management for YouTube/Vimeo.

For GDPR-compliant embeds, install the [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager):

```bash
composer require friendsofredaxo/consent_manager
```

The Consent Manager will automatically handle consent for YouTube and Vimeo embeds.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, Vidstack will gracefully degrade to native video/audio elements.

## Migration from Vidstack 1.x

See [MIGRATION.md](MIGRATION.md) for detailed migration instructions.

**Breaking Changes:**
- Package name: `vidstack` → `vidstack`
- Namespace: `FriendsOfRedaxo\VidStack\Video` → `FriendsOfRedaxo\VidstackPlayer\VidstackPlayer`
- Class name: `Video` → `VidstackPlayer` (reflects audio support)
- API: Setter methods → Fluent method chaining
- Assets: Use `AssetHelper::getCss()` and `getJs()` instead of manual inclusion

## Development

Dieses Addon nutzt die [Standard GitHub Workflows für REDAXO Addons](https://github.com/FriendsOfREDAXO/github-workflows).

### Setup

```bash
# Das Addon muss im REDAXO-Kontext entwickelt werden
# Klone REDAXO und installiere das Addon dort

# Install Node dependencies
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
npm run build              # Build assets
npx eslint config/*.js     # Lint JavaScript  
npx eslint config/*.js --fix  # Auto-fix JavaScript
```

### GitHub Actions

Automatisch bei jedem Push/PR:

1. **Code Style** - PHP-CS-Fixer formatiert Code automatisch
2. **Rexstan** - PHPStan für REDAXO (Level 9)
3. **Build Assets** - ESLint + npm build
4. **Publish to REDAXO** - Bei GitHub Release

[Mehr Infos zu den Workflows](https://github.com/FriendsOfREDAXO/github-workflows)

## License

MIT License - See [LICENSE](LICENSE) file

## Credits

- Built with [Vidstack](https://vidstack.io)
- Maintained by [Friends Of REDAXO](https://github.com/FriendsOfREDAXO)
- For REDAXO CMS

## Support

- **Issues:** [GitHub Issues](https://github.com/FriendsOfREDAXO/vidstack/issues)
- **REDAXO Slack:** #addons channel
- **Forum:** [REDAXO Forum](https://www.redaxo.org/forum/)

