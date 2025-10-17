# Vidstack für REDAXO

Moderner Video-Player für REDAXO mit YouTube, Vimeo und lokalen Videos.

## Installation

Via REDAXO Installer oder GitHub Release herunterladen.

## Schnellstart

### 1. Assets einbinden

Im Template:

```php
// CSS
echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack.css') . '">';
echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';

// JavaScript  
echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack.js') . '"></script>';
echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';
```

### 2. Video einbinden

```php
use FriendsOfRedaxo\VidStack\Video;

// YouTube
echo Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video')->generateFull();

// Lokales Video
echo Video::local('video.mp4', 'Mein Video')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9')
    ->generateFull();
```

## Neue API v2.0

### Factory Methods

```php
Video::youtube($url, $title)   // YouTube mit Consent Manager
Video::vimeo($url, $title)     // Vimeo mit Consent Manager
Video::local($file, $title)    // Lokales Video mit Smart Defaults
Video::tutorial($src, $title)  // Tutorial mit Resume-Funktion
```

### Fluent Interface

Alle Methoden geben `$this` zurück:

```php
$video = Video::local('tutorial.mp4', 'REDAXO Tutorial')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9')
    ->setLoadStrategy('visible')
    ->addCaptions('de.vtt', 'Deutsch', true)
    ->addChapters('chapters.vtt')
    ->enableResume()
    ->autoplay()
    ->loop();
    
echo $video->generateFull();
```

### Neue Features

**Aspect Ratio** - Verhindert Layout Shift:
```php
$video->setAspectRatio('16/9');  // oder '4/3', '21/9', '1/1'
```

**Loading Strategy** - Performance:
```php
$video->setLoadStrategy('visible');  // 'eager', 'idle', 'visible', 'play'
```

**Resume Support** - Position merken:
```php
$video->enableResume();              // Auto Storage-Key
$video->enableResume('tutorial-1');  // Custom Key
```

**Chapters** - Navigation:
```php
$video->addChapters('chapters.vtt');
```

**Captions** - Vereinfacht:
```php
$video->addCaptions('de.vtt', 'Deutsch', true);
```

**Convenience Methods**:
```php
$video->autoplay();  // Mit Mute
$video->loop();      // Endlos
$video->muted();     // Stumm
```

## DSGVO & Consent Manager

YouTube und Vimeo werden automatisch über den Consent Manager geblockt:

```php
$video = Video::youtube('https://youtube.com/watch?v=xyz', 'Titel')
    ->setPoster('thumb.jpg');
    
echo $video->generateFull();
```

**Setup:** Im Consent Manager Services mit UID `youtube` und `vimeo` anlegen.

## Beispiele

### YouTube mit Autoplay

```php
Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')
    ->autoplay()
    ->loop()
    ->generateFull();
```

### Tutorial mit Resume

```php
Video::tutorial('tutorial.mp4', 'REDAXO Tutorial')
    ->setPoster('thumb.jpg')
    ->addChapters('chapters.vtt')
    ->addCaptions('de.vtt', 'Deutsch', true)
    ->enableResume()
    ->generateFull();
```

### Multi-Resolution

```php
Video::local('video.mp4', 'Responsive Video')
    ->setResponsiveSourcesWithPresets(
        'video-1080p.mp4',
        'video-480p.mp4',
        '1080p',
        'mobile_sd'
    )
    ->generateFull();
```

Verfügbare Presets: `4k`, `2k`, `1080p`, `720p`, `480p`, `mobile_hd`, `mobile_sd`

### Audio-Player

```php
Video::local('podcast.mp3', 'Podcast')
    ->setAttribute('audio', true)
    ->generateFull();
```

## Alte API (v1.x)

Funktioniert weiterhin:

```php
$video = new Video('video.mp4', 'Titel');
$video->setPoster('thumb.jpg');
$video->addSubtitle('de.vtt', 'captions', 'Deutsch', 'de', true);
echo $video->generateFull();
```

## API-Referenz

### Factory Methods (NEU)
- `Video::youtube($url, $title)`
- `Video::vimeo($url, $title)`
- `Video::local($filename, $title)`
- `Video::tutorial($source, $title)`

### Phase 1 Features (NEU)
- `setAspectRatio($ratio)`
- `setLoadStrategy($strategy)`
- `enableResume($key = null)`
- `addChapters($vttFile)`
- `addCaptions($vtt, $label, $default = false)`
- `autoplay()`
- `loop()`
- `muted($muted = true)`

### Basis-Methoden
- `setPoster($src, $alt = '')`
- `setThumbnails($url)`
- `setAttribute($key, $value)`
- `setAttributes($array)`
- `setA11yContent($content)`
- `generate()`
- `generateFull()`

### Alte Methoden
- `new Video($source, $title, $lang = 'de')`
- `addSubtitle($src, $kind, $label, $lang, $default)`
- `setSources($sources)`
- `setResponsiveSources($desktop, $mobile, $desktopSize, $mobileSize)`
- `setResponsiveSourcesWithPresets($desktop, $mobile, $desktopPreset, $mobilePreset)`
- `createAutoSources($basename)`

## Migration v1.x → v2.0

**Keine Breaking Changes!** Alter Code funktioniert weiter.

**Neu nutzen:**
1. Factory Methods statt `new Video()`
2. `addCaptions()` statt `addSubtitle()`
3. Consent Manager statt eigener Placeholder-Logik

## Tipps

### Helper-Funktion

```php
function defaultVideo($src, $title) {
    return Video::local($src, $title)
        ->setPoster($src . '.jpg')
        ->setAspectRatio('16/9')
        ->setLoadStrategy('visible');
}
```

### REX_MEDIA Integration

```php
$mediaFile = 'REX_MEDIA[1]';
if ($mediaFile) {
    echo Video::local($mediaFile, 'Video')
        ->setPoster(rex_url::media('REX_MEDIA[2]'))
        ->generateFull();
}
```

### OEmbed für CKEditor 5

```php
// In boot.php
if (rex::isFrontend()) {
    Video::videoOembedHelper();
}
```

## FFmpeg Integration

Mit FFmpeg AddOn:
- Video-Infos im Medienpool
- Action-Buttons (Trimmen, Optimieren)
- Automatische Metadaten

## Support

- GitHub Issues: https://github.com/FriendsOfREDAXO/vidstack/issues
- REDAXO Forum: https://www.redaxo.org/forum/
- Slack: https://friendsofredaxo.slack.com/

## Dokumentation

- `CONSENT_MANAGER_INTEGRATION.md` - DSGVO Details
- `INTEGRATION_FLOW.md` - Architektur

## Lizenz

MIT License

---

**Entwickelt von:** FriendsOfREDAXO & Thomas Skerbis  
**Basis:** Vidstack.io  
**System:** REDAXO CMS
