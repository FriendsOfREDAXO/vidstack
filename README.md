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

// Auto-Erkennung 
echo Video::create('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video')->generateFull();
echo Video::create('video.mp4', 'Lokales Video')->generateFull();

// Oder explizit
echo Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video')->generateFull();

// Lokales Video mit Optionen
echo Video::local('video.mp4', 'Mein Video')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9')
    ->generateFull();
```

## Neue API v2.0

### Factory Methods

```php
Video::create($source, $title) // Auto-Erkennung (YouTube, Vimeo, lokal)
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

### Auto-Erkennung

```php
// Erkennt automatisch YouTube, Vimeo oder lokale Dateien
echo Video::create('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'YouTube Video')->generateFull();
echo Video::create('https://vimeo.com/123456789', 'Vimeo Video')->generateFull();
echo Video::create('video.mp4', 'Lokales Video')->generateFull();
```

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
- `Video::create($source, $title)` - Automatische Erkennung (YouTube, Vimeo, lokal)
- `Video::youtube($url, $title)` - YouTube-Video mit Consent Manager
- `Video::vimeo($url, $title)` - Vimeo-Video mit Consent Manager
- `Video::local($filename, $title)` - Lokales Video/Audio
- `Video::tutorial($source, $title)` - Tutorial-Video mit Resume

### V. 2.x Features (NEU)
- `setAspectRatio($ratio)` - Seitenverhältnis (16/9, 4/3, 21/9, 1/1)
- `setLoadStrategy($strategy)` - Ladeverhalten: eager, idle, visible, play
- `enableResume($key = null)` - Wiedergabeposition speichern
- `addChapters($vttFile)` - Kapitel-Navigation
- `addCaptions($vtt, $label, $default = false)` - Untertitel
- `addTranscript($vttFile, $label = "")` - Transkript für Screen-Reader
- `addAudioDescription($vttFile, $label = "", $default = false)` - Audiodeskription
- `autoplay()` - Automatische Wiedergabe (mit Mute)
- `loop()` - Endlos-Wiedergabe
- `muted($muted = true)` - Stumm schalten
### Basis-Methoden
- `setPoster($src, $alt = '')` - Poster-Bild setzen
- `setThumbnails($url)` - Thumbnail-Sprites (VTT-Datei)
- `setAttribute($key, $value)` - Einzelnes Attribut setzen
- `setAttributes($array)` - Mehrere Attribute setzen
- `setA11yContent($content)` - Barrierefreier Alternativ-Content
- `generate()` - Player-HTML generieren
- `generateFull()` - Player-HTML mit Container und A11y-Content

### Utility-Methoden (Statisch)
- `Video::getVideoInfo($source)` - Plattform und ID ermitteln (youtube, vimeo, default)
- `Video::isMedia($url)` - Prüft ob es eine Medien-Datei ist
- `Video::isAudio($url)` - Prüft ob es eine Audio-Datei ist
- `Video::isPlayable($source)` - Prüft ob die Quelle abspielbar ist
- `Video::getResolutionPresets()` - Verfügbare Auflösungs-Presets

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

### Utility-Methoden verwenden

```php
// Video-Typ und ID ermitteln
$info = Video::getVideoInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// ['platform' => 'youtube', 'id' => 'dQw4w9WgXcQ']

$info = Video::getVideoInfo('https://vimeo.com/123456789');
// ['platform' => 'vimeo', 'id' => '123456789']

$info = Video::getVideoInfo('video.mp4');
// ['platform' => 'default', 'id' => '']

// Medien-Typ prüfen
if (Video::isAudio('podcast.mp3')) {
    echo 'Das ist eine Audio-Datei';
}

if (Video::isMedia('video.mp4')) {
    echo 'Das ist eine Medien-Datei';
}

if (Video::isPlayable($source)) {
    echo Video::create($source, 'Mein Video')->generateFull();
}
```

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


## Barrierefreiheit (A11y)

### WCAG-Konformität

**Status:** WCAG 2.1 Level AA konform ✅

- **Level A:** Vollständig erfüllt
- **Level AA:** Vollständig erfüllt  
- **Level AAA:** Teilweise erfüllt

### Unterstützte Features

#### Tastaturnavigation
Vollständige Steuerung ohne Maus:

| Taste | Funktion |
|-------|----------|
| **Space / K** | Play/Pause |
| **←/→** | 5 Sekunden vor/zurück |
| **J / L** | 10 Sekunden vor/zurück |
| **↑/↓** | Lautstärke +/- 5% |
| **M** | Stumm schalten |
| **F** | Vollbild |
| **C** | Untertitel an/aus |
| **0-9** | Zu Position springen (0%, 10%, ..., 90%) |
| **Home / End** | Zum Anfang/Ende |

#### Screen-Reader-Optimierung

```php
// Skip-Links für schnelle Navigation
Video::local('video.mp4', 'Tutorial')
    ->setA11yContent('Detaillierte Videobeschreibung für Screen-Reader')
    ->generateFull();

// Transkript hinzufügen
Video::local('interview.mp4', 'Interview')
    ->addTranscript('transcript.vtt', 'Vollständiges Transkript')
    ->generateFull();

// Audiodeskription für blinde Nutzer
Video::local('film.mp4', 'Kurzfilm')
    ->addAudioDescription('audiodesc.vtt', 'Audiodeskription', true)
    ->generateFull();
```

#### Untertitel & Transkripte

```php
// Mehrsprachige Untertitel
$video = Video::local('presentation.mp4', 'Präsentation')
    ->addCaptions('de.vtt', 'Deutsch', true)
    ->addCaptions('en.vtt', 'English', false)
    ->addCaptions('fr.vtt', 'Français', false)
    ->addTranscript('transcript-de.vtt', 'Transkript (Deutsch)')
    ->generateFull();
```

**VTT-Format-Beispiel:**
```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Willkommen zu unserem Tutorial über REDAXO CMS.

00:00:05.000 --> 00:00:10.000
In diesem Video zeigen wir die Installation.
```

#### Visuelle Anpassungen

- **Fokus-Indikatoren:** 3px blaue Umrandung + Schatten
- **High-Contrast Modus:** Automatische Anpassung bei `prefers-contrast: high`
- **Reduced Motion:** Respektiert `prefers-reduced-motion` (keine Animationen)
- **Touch-Targets:** Mindestgröße 44x44px (WCAG 2.5.5)

#### Live-Regions

Automatische Status-Ansagen für Screen-Reader:
- Play/Pause-Status
- Lautstärke-Änderungen
- Zeitsprünge
- Fehler-Meldungen

### Best Practices

#### 1. Immer Titel angeben
```php
// ✅ Gut: Beschreibender Titel
Video::youtube('...', 'REDAXO Installation Tutorial - Teil 1')

// ❌ Schlecht: Keine Beschreibung
Video::youtube('...', 'Video')
```

#### 2. Poster-Bilder mit Alt-Text
```php
$video->setPoster('thumb.jpg', 'Screenshot: REDAXO Dashboard mit Modul-Editor');
```

#### 3. Untertitel für alle Sprach-Inhalte
```php
// Für Videos mit gesprochenem Text IMMER Untertitel hinzufügen
$video->addCaptions('de.vtt', 'Deutsch', true);
```

#### 4. Transkripte für komplexe Inhalte
```php
// Bei Interviews, Präsentationen, Tutorials
$video->addTranscript('transcript.vtt', 'Vollständiges Transkript');
```

#### 5. Audiodeskription für visuelle Inhalte
```php
// Wenn wichtige Informationen nur visuell vermittelt werden
$video->addAudioDescription('audiodesc.vtt', 'Audiodeskription');
```

#### 6. Sinnvolle Aspect Ratios
```php
// Verhindert Layout-Shift beim Laden
$video->setAspectRatio('16/9');
```

#### 7. Loading Strategy für Performance
```php
// Lädt Video erst bei Sichtbarkeit → bessere Performance
$video->setLoadStrategy('visible');
```

#### 8. Resume-Funktion für lange Videos
```php
// Nutzerfreundlich bei Tutorials > 5 Minuten
$video->enableResume();
```

#### 9. A11y-Content für Kontext
```php
$video->setA11yContent(
    'Dieses Video zeigt die Installation von REDAXO CMS Schritt für Schritt. ' .
    'Es werden folgende Themen behandelt: Download, Upload, Installation, ' .
    'erste Schritte im Backend.'
);
```

#### 10. Audio-Player explizit kennzeichnen
```php
Video::local('podcast.mp3', 'Podcast Episode 42: REDAXO AddOns')
    ->setAttribute('audio', true)
    ->addTranscript('podcast-transcript.vtt')
    ->generateFull();
```

### Testing

Siehe `A11Y_TESTING_GUIDE.md` für:
- Manuelle Tests (Tastatur, Screen-Reader, etc.)
- Automatisierte Tools (axe DevTools, WAVE, Lighthouse, Pa11y)
- WCAG-Checklisten
- Screen-Reader-Kompatibilität (NVDA, JAWS, VoiceOver, etc.)

### Weitere Ressourcen

- [Vidstack Accessibility Guide](https://vidstack.io/docs/player/getting-started/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebVTT Specification](https://www.w3.org/TR/webvtt1/)

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
