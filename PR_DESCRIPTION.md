# Add Source Sizes Support for Desktop/Mobile Video Qualities

## 🎯 Beschreibung

Diese PR implementiert **Source Sizes** Support für das Vidstack REDAXO-Addon, wie in der [Vidstack-Dokumentation](https://vidstack.io/docs/player/core-concepts/loading/#source-sizes) beschrieben. Dies ermöglicht es, verschiedene Video-Auflösungen für Desktop und Mobile bereitzustellen.

## ✨ Neue Features

### Neue Methoden in der Video-Klasse:

- **`setSources(array $sources, bool $autoSort = true)`** - Für mehrere Video-Qualitäten mit Sortierungskontrolle
- **`setResponsiveSources(string $desktop, string $mobile, array $desktopRes = [1920, 1080], array $mobileRes = [854, 480])`** - Flexible Desktop/Mobile Setup
- **`setResponsiveSourcesWithPresets(string $desktop, string $mobile, string $desktopPreset = '1080p', string $mobilePreset = '480p')`** - Mit vordefinierte Auflösungspresets
- **`createAutoSources(string $baseFilename, array $qualityLevels = null, string $extension = 'mp4')`** - Automatische Source-Erstellung aus Dateinamen-Pattern
- **`getResolutionPresets()`** - Statische Methode für vordefinierte Auflösungen
- **`generateSourceElements()`** - Optimierte Source-Generierung mit Caching
- **`getMediaType(string $source)`** - Verbesserte Media-Type-Erkennung

### Erweiterte Funktionalität:

- **Flexible Auflösungen** - Benutzerdefinierte Auflösungen als Parameter
- **Auflösungspresets** - Vordefinierte Standards (4K, 2K, 1080p, 720p, 480p, mobile_hd, etc.)
- **Performance-Optimierung** - Sortierung wird gecacht, optional deaktivierbar
- **Auto-Source-Erstellung** - Automatisches Finden von Qualitätsvarianten basierend auf Dateinamen
- **Intelligente Type-Detection** - Erweiterte Media-Type-Erkennung
- Automatische Sortierung der Quellen nach Qualität (höchste zuerst)
- Support für `width`/`height` Attribute auf `<source>`-Elementen
- Vollständig **rückwärtskompatibel** mit bestehender Implementierung
- Intelligente Fallback-Mechanismen

## 🚀 Verwendung

### Einfache Desktop/Mobile Implementierung:
```php
// Standard-Auflösungen (1920x1080 / 854x480)
$video = new Video('video-desktop.mp4', 'Responsives Video');
$video->setResponsiveSources('video-1080p.mp4', 'video-480p.mp4');
echo $video->generateFull();

// Benutzerdefinierte Auflösungen
$video = new Video('video.mp4', 'Custom Video');
$video->setResponsiveSources(
    'video-2k.mp4', 'video-mobile.mp4',
    [2560, 1440], // Desktop: 2K
    [960, 540]    // Mobile: HD
);
echo $video->generateFull();

// Mit Auflösungspresets
$video = new Video('video.mp4', 'Preset Video');
$video->setResponsiveSourcesWithPresets('video-high.mp4', 'video-low.mp4', '2k', 'mobile_hd');
echo $video->generateFull();
```

### Automatische Source-Erstellung:
```php
$video = new Video('produktvideo.mp4', 'Produktvideo');
// Sucht automatisch nach: produktvideo-1080p.mp4, produktvideo-720p.mp4, produktvideo-480p.mp4
if ($video->createAutoSources('produktvideo')) {
    echo $video->generateFull();
}
```

### Mehrere Qualitätsstufen:
```php
$video = new Video('video.mp4', 'Multi-Quality Video');
$video->setSources([
    ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
    ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],
    ['src' => 'video-480p.mp4', 'width' => 854, 'height' => 480, 'type' => 'video/mp4']
]);
echo $video->generateFull();
```

### Integration in REDAXO-Module:
```php
// REX_MEDIA[1] = Desktop Video, REX_MEDIA[2] = Mobile Video
$video = new Video('REX_MEDIA[1]', 'REX_VALUE[1]');
if ('REX_MEDIA[2]') {
    $video->setResponsiveSources('REX_MEDIA[1]', 'REX_MEDIA[2]');
}
echo $video->generateFull();
```

### Performance-Optimierung:
```php
// Bereits sortierte Sources - ohne automatisches Sorting
$video = new Video('video.mp4', 'Performance Video');
$video->setSources($sortedSources, false); // autoSort = false
echo $video->generateFull();
```

### Verfügbare Auflösungspresets:
- **Ultra HD**: `4k` (3840×2160), `2k` (2560×1440)
- **Standard**: `1080p` (1920×1080), `720p` (1280×720), `480p` (854×480), `360p` (640×360)
- **Mobile**: `mobile_hd` (960×540), `mobile_sd` (640×360), `tablet` (1024×576)

## 🔧 Technische Details

### Generiertes HTML:
```html
<media-player>
  <media-provider>
    <source src="video-1080p.mp4" type="video/mp4" width="1920" height="1080" />
    <source src="video-720p.mp4" type="video/mp4" width="1280" height="720" />
    <source src="video-480p.mp4" type="video/mp4" width="854" height="480" />
  </media-provider>
  <media-video-layout></media-video-layout>
</media-player>
```

### Browser-Verhalten:
- Browser wählt automatisch die beste verfügbare Quelle
- Basierend auf Gerätegröße, Netzwerkbedingungen und verfügbarer Bandbreite
- Folgt den Web Standards für adaptive Media-Auswahl

## 📁 Geänderte/Neue Dateien

- **`lib/video.php`** - Erweiterte Video-Klasse mit Source Sizes Support
- **`README.md`** - Dokumentation und Beispiele hinzugefügt
- **`examples/source-sizes-examples.php`** - Umfassende Implementierungsbeispiele

## ✅ Kompatibilität

- ✅ **Vollständig rückwärtskompatibel** - bestehender Code funktioniert unverändert
- ✅ **Keine Breaking Changes** - alle bestehenden Methoden bleiben unverändert
- ✅ **Graceful Fallback** - bei fehlenden Quellen wird automatisch Single Source verwendet
- ✅ **REDAXO 5.17.1+** - wie gewohnt

## 🧪 Tests

- [x] Single Source (bestehende Funktionalität) - funktioniert
- [x] Desktop/Mobile Sources - funktioniert  
- [x] Multiple Quality Sources - funktioniert
- [x] YouTube/Vimeo (externe Quellen) - funktioniert unverändert
- [x] Audio-Dateien - funktionieren unverändert
- [x] Rückwärtskompatibilität - alle bestehenden Implementierungen funktionieren

## 📋 Checklist

- [x] Code implementiert und getestet
- [x] Dokumentation in README.md erweitert
- [x] Beispiele erstellt (`examples/source-sizes-examples.php`)
- [x] Rückwärtskompatibilität sichergestellt
- [x] Commit-Message nach Conventional Commits
- [x] Keine Breaking Changes

## 🎬 Warum diese Implementierung?

Diese Implementierung folgt den **Vidstack-Empfehlungen** für Source Sizes und ermöglicht es Entwicklern:

1. **Performance-Optimierung** - Kleinere Dateien für Mobile, größere für Desktop
2. **Bandbreiten-Effizienz** - Browser wählt automatisch die optimale Qualität
3. **Benutzerfreundlichkeit** - Nahtlose Wiedergabe ohne Bandbreiten-Probleme
4. **Zukunftssicherheit** - Standard-konforme Implementierung

## 🔗 Referenzen

- [Vidstack Source Sizes Dokumentation](https://vidstack.io/docs/player/core-concepts/loading/#source-sizes)
- [HTML Video Element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Media Source Selection - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)

---

Ready to merge! 🚀
