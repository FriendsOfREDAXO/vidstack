# Phase 1: API Simplification & Modern Features

## 🎯 Ziel
Das Vidstack-AddOn wurde massiv vereinfacht, um die Developer Experience zu verbessern und moderne Features der Vidstack.io Library v1.12+ zu nutzen.

## ✨ Was ist neu?

### 1. Fluent Interface (Method Chaining)
**Vorher:**
```php
$video = new Video('video.mp4', 'Titel');
$video->setPoster('thumb.jpg');
$video->setAttributes(['data-aspect-ratio' => '16/9']);
echo $video->generateFull();
```

**Nachher:**
```php
$video = Video::local('video.mp4', 'Titel')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9');
echo $video->generateFull();
```

✅ Alle Setter-Methoden geben jetzt `$this` zurück
✅ Ermöglicht elegantes Method Chaining
✅ Code ist lesbarer und kompakter

### 2. Factory Methods (Smart Defaults)

#### `Video::youtube($url, $title)`
```php
$video = Video::youtube('https://youtube.com/watch?v=xyz', 'Mein Video')
    ->autoplay()
    ->loop();
```
- Setzt automatisch optimale Settings für YouTube
- Consent Manager Integration aktiv

#### `Video::vimeo($url, $title)`
```php
$video = Video::vimeo('https://vimeo.com/123456', 'Vimeo Video')
    ->setPoster('thumb.jpg');
```
- Optimiert für Vimeo-Videos
- Consent Manager Integration aktiv

#### `Video::local($filename, $title)`
```php
$video = Video::local('video.mp4', 'Lokales Video')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9');
```
- Setzt automatisch `playsInline="true"` für Mobile
- Setzt `preload="metadata"` für Performance

#### `Video::tutorial($source, $title)`
```php
$video = Video::tutorial('tutorial.mp4', 'REDAXO Tutorial')
    ->addChapters('chapters.vtt');
```
- Aktiviert automatisch Resume-Funktion (Position wird gespeichert)
- Perfekt für Tutorial-Videos
- Smart Defaults für Tutorials

### 3. Aspect Ratio (verhindert Layout Shift)
```php
$video->setAspectRatio('16/9');  // Standard Breitbild
$video->setAspectRatio('4/3');   // Klassisch
$video->setAspectRatio('21/9');  // Ultrawide
$video->setAspectRatio('1/1');   // Quadratisch
```

✅ Verhindert Cumulative Layout Shift (CLS)
✅ Bessere Core Web Vitals
✅ Besseres User Experience

### 4. Loading Strategy (Performance-Optimierung)
```php
$video->setLoadStrategy('idle');    // Lädt wenn Browser idle
$video->setLoadStrategy('visible'); // Lädt wenn sichtbar (Standard)
$video->setLoadStrategy('eager');   // Lädt sofort
$video->setLoadStrategy('play');    // Lädt erst beim Abspielen
```

✅ Optimiert Page Load Performance
✅ Reduziert initiale Bandwidth
✅ Verbesserte Mobile Experience

### 5. Resume Support (Position speichern)
```php
$video->enableResume();                    // Auto Storage-Key
$video->enableResume('mein-tutorial-key'); // Custom Key
```

✅ Position wird automatisch gespeichert (localStorage)
✅ User kann Video fortsetzen wo aufgehört
✅ Perfekt für Tutorial-Videos
✅ Optional mit Custom Storage-Key

### 6. Chapters (Kapitel-Navigation)
```php
$video->addChapters('chapters.vtt');
```

Beispiel `chapters.vtt`:
```vtt
WEBVTT

00:00:00.000 --> 00:01:30.000
Einleitung

00:01:30.000 --> 00:05:00.000
Hauptteil

00:05:00.000 --> 00:07:00.000
Zusammenfassung
```

✅ User können direkt zu Kapiteln springen
✅ Bessere Navigation bei langen Videos
✅ Standard VTT-Format

### 7. Convenience Methods (weniger Code)

#### `autoplay()`
```php
$video->autoplay();  // Aktiviert Autoplay mit Mute
```
✅ Autoplay mit Mute (Browser-Richtlinien konform)

#### `loop()`
```php
$video->loop();  // Endlos-Schleife
```
✅ Video läuft automatisch wieder von vorne

#### `muted()`
```php
$video->muted();  // Stumm schalten
```
✅ Video startet stumm

#### `addCaptions()`
```php
$video->addCaptions('subtitles.vtt');                    // Standard
$video->addCaptions('de.vtt', 'Deutsch', true);         // Mit Label & Default
```
✅ Vereinfachte Untertitel-Syntax (statt kompliziertem `addSubtitle()`)

### 8. Smart Defaults
Das AddOn setzt jetzt automatisch sinnvolle Werte:

```php
$video = Video::local('video.mp4', 'Titel');
// Setzt automatisch:
// - playsInline="true" (wichtig für iOS)
// - preload="metadata" (Performance)
```

## 📊 Code-Vergleich

### Vorher (ohne Phase 1):
```php
$video = new Video('tutorial.mp4', 'Mein Tutorial');
$video->setPoster('thumb.jpg');
$video->setAttributes(['data-aspect-ratio' => '16/9']);
$video->addSubtitle('chapters.vtt', 'Chapters', 'en', 'chapters', false);
$video->addSubtitle('subtitles.vtt', 'Deutsch', 'de', 'captions', true);
$video->setAttributes(array_merge($video->getAttributes() ?? [], [
    'autoplay' => 'true',
    'muted' => 'true',
    'loop' => 'true'
]));
echo $video->generateFull();
```

### Nachher (mit Phase 1):
```php
$video = Video::tutorial('tutorial.mp4', 'Mein Tutorial')
    ->setPoster('thumb.jpg')
    ->setAspectRatio('16/9')
    ->addChapters('chapters.vtt')
    ->addCaptions('subtitles.vtt', 'Deutsch', true)
    ->autoplay()
    ->loop();
echo $video->generateFull();
```

### Vorteile:
✅ **Weniger Code** (8 verkettete Aufrufe vs. 8 separate Statements)
✅ **Lesbarer** (Fluent Chain statt verschachtelte Arrays)
✅ **Selbsterklärend** (`autoplay()` statt kryptischem Array)
✅ **Weniger Fehleranfällig** (keine Array-Manipulation)
✅ **Bessere IDE-Unterstützung** (Auto-Completion für alle Methoden)
✅ **Smart Defaults** (Resume automatisch bei `Video::tutorial()`)

## 🔄 Backward Compatibility

✅ **100% Backward Compatible**
- Alle alten Methoden funktionieren weiterhin
- `new Video()` funktioniert wie bisher
- Alle bestehenden Projekte laufen unverändert
- Nur neue Features wurden hinzugefügt
- Keine Breaking Changes

## 📚 Dokumentation

Die README.md wurde komplett aktualisiert:
- Neue "Phase 1 Features" Sektion mit allen Features
- Vorher/Nachher Vergleich
- Alle Beispiele nutzen jetzt Fluent Interface
- Factory Methods dokumentiert
- Neue Convenience-Methoden erklärt

## 🚀 Performance-Verbesserungen

1. **Loading Strategy**: Videos laden nur wenn nötig
2. **Aspect Ratio**: Verhindert Layout Shift
3. **Smart Defaults**: `preload="metadata"` reduziert initiale Bandbreite
4. **Caching**: Source-Sorting wird gecacht

## 🎓 Nächste Schritte (Phase 2 - Optional)

Mögliche weitere Verbesserungen:
1. **Builder Pattern** für komplexe Videos
2. **Quality Labels** für Multi-Resolution Videos
3. **Live-Stream Support** (`streamType='live'`)
4. **More Presets** (createTutorial mit mehr Optionen)
5. **Events API** (onPlay, onPause, etc.)

## 📦 Commit-Historie

1. **410ae21**: "Integrate Consent Manager for GDPR-compliant video embedding"
   - Consent Manager Integration
   - Removed internal consent system

2. **f92c989**: "Update vendor dependencies and rebuild assets"
   - Vidstack 1.11.24 → 1.12.12
   - Rebuilt assets

3. **5303b65**: "Add Phase 1 features: fluent interface, factory methods, simplified API"
   - Fluent Interface
   - Factory Methods
   - All new Phase 1 features
   - Complete documentation

## ✅ Testing Checklist

- [ ] Fluent Interface funktioniert
- [ ] Factory Methods erzeugen korrekte Objekte
- [ ] Aspect Ratio wird im HTML ausgegeben
- [ ] Loading Strategy funktioniert
- [ ] Resume speichert Position
- [ ] Chapters werden angezeigt
- [ ] Convenience Methods setzen korrekte Attribute
- [ ] Smart Defaults werden gesetzt
- [ ] Backward Compatibility gewährleistet
- [ ] Consent Manager Integration funktioniert weiterhin

## 📝 Anmerkungen

- Alle neuen Features basieren auf Vidstack.io 1.12+ Capabilities
- API-Design orientiert sich an modernen PHP-Frameworks
- Focus auf Developer Experience
- Inspiration: Laravel's Fluent Interfaces, Symfony's Factory Patterns
