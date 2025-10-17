# Consent Manager Integration für Vidstack

## Übersicht

Ab Version 2.0.0 nutzt das Vidstack-Addon das [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager) für DSGVO-konforme Einbindung von YouTube- und Vimeo-Videos.

## Was wurde geändert?

### Entfernte Funktionen

Das eigene Consent-System von Vidstack wurde entfernt:

- ❌ `generateConsentPlaceholder()` Methode
- ❌ Eigenes localStorage/Cookie-Management
- ❌ Consent-Placeholder HTML/CSS
- ❌ JavaScript Consent-Logik in `vidstack_helper.js`

### Neue Funktionsweise

Videos werden jetzt **direkt mit src-Attribut** ausgegeben:

```php
// Vorher (mit eigenem Consent):
<media-player data-video-platform="youtube" data-video-id="dQw4w9WgXcQ">

// Jetzt (src direkt gesetzt):
<media-player src="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
```

Der **Consent Manager** übernimmt das Blocking:
- Erkennt YouTube/Vimeo-URLs automatisch
- Ersetzt durch Inline-Consent-Placeholder
- Lädt Video erst nach Einwilligung

## Wie funktioniert die Integration?

### 1. Consent Manager installieren

```bash
# Via REDAXO Installer
Installer → AddOns → consent_manager
```

### 2. Consent Manager konfigurieren

```php
// In der Consent Manager Konfiguration:
// Domains → Neue Domain hinzufügen oder bearbeiten
// Service-Type: youtube / vimeo
```

### 3. Vidstack nutzen wie gewohnt

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// YouTube-Video
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video');
echo $video->generateFull();

// Vimeo-Video
$vimeo = new Video('https://vimeo.com/148751763', 'Vimeo-Beispiel');
echo $vimeo->generateFull();
```

Der Consent Manager erkennt die URLs automatisch und blockiert sie bis zur Einwilligung.

## Vorteile der Integration

### Für Entwickler

✅ **Weniger Code**: Keine doppelte Consent-Logik mehr
✅ **Zentrale Verwaltung**: Ein AddOn für alle Consent-Fragen
✅ **Konsistenz**: Gleiche UX für Videos, Maps, Analytics etc.
✅ **Wartbarkeit**: Updates nur im Consent Manager nötig

### Für Nutzer

✅ **Einheitlich**: Gleiche Consent-Abfrage für alle externen Inhalte
✅ **Übersichtlich**: Zentrale Cookie-Einstellungen
✅ **Flexibel**: 5 Theme-Varianten wählbar
✅ **Mehrsprachig**: Deutsche und englische Texte

## Migration von altem Vidstack

Falls Sie die alte Version mit eigenem Consent nutzen:

### JavaScript/CSS anpassen

```php
// Alte Einbindung (kann bleiben):
echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';
echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';

// Die Helper-Dateien enthalten jetzt nur noch Translation-Support
// Consent-Code wurde entfernt
```

### PHP-Code

Ihr PHP-Code bleibt **unverändert**:

```php
// Funktioniert weiterhin:
$video = new Video('https://www.youtube.com/watch?v=xyz', 'Titel');
echo $video->generateFull();
```

### Alte Consent-Cookies

```javascript
// Alte Cookies werden nicht mehr benötigt:
// - youtube_consent
// - vimeo_consent
// - localStorage: video_consent

// Consent Manager nutzt eigene Cookies:
// - consent_manager_consent
```

## Beispiele

### YouTube mit Poster und Untertiteln

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tutorial');
$video->setPoster('vorschau.jpg', 'Vorschaubild');
$video->addSubtitle('untertitel.vtt', 'captions', 'Deutsch', 'de', true);

// Consent Manager blockiert automatisch
echo $video->generateFull();
```

### Vimeo mit A11y-Content

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

$vimeo = new Video('https://vimeo.com/148751763', 'Präsentation');
$vimeo->setA11yContent(
    'Eine Videopräsentation über Webentwicklung mit modernen Technologien.',
    'https://example.com/transkript.html'
);

// Consent Manager blockiert automatisch
echo $vimeo->generateFull();
```

### Lokale Videos (kein Consent nötig)

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// Lokale Videos werden NICHT geblockt
$local = new Video('mein-video.mp4', 'Lokales Video');
echo $local->generate();
```

## Consent Manager Inline-Consent

Der Consent Manager nutzt **Inline-Consent** für Videos:

```
┌─────────────────────────────────────┐
│                                     │
│   [Vorschaubild oder Placeholder]   │
│                                     │
│   📹 YouTube-Video                  │
│                                     │
│   Für die Anzeige werden Cookies    │
│   von YouTube benötigt.             │
│                                     │
│   [Video laden]  [Mehr Infos]      │
│                                     │
└─────────────────────────────────────┘
```

Nach Klick auf "Video laden":
- ✅ Consent wird gespeichert (Cookie/DB)
- ✅ Video wird geladen und abgespielt
- ✅ Weitere Videos der Domain werden automatisch erlaubt

## Technische Details

### Wie erkennt Vidstack, dass Consent benötigt wird?

Vidstack prüft in `generateFull()` automatisch:

```php
// 1. Ist es YouTube oder Vimeo?
$videoInfo = Video::getVideoInfo($source);
if ($videoInfo['platform'] === 'youtube' || $videoInfo['platform'] === 'vimeo') {
    
    // 2. Ist der Consent Manager verfügbar?
    if (class_exists('consent_manager_inline')) {
        
        // 3. Consent Manager nutzen
        $playerCode = consent_manager_inline::doConsent('youtube', $playerCode, $options);
    }
}
```

### Blocking-Mechanismus

1. **Direkte Integration**: Vidstack ruft `consent_manager_inline::doConsent()` direkt auf
2. **Service-Mapping**: `youtube` → YouTube-Service, `vimeo` → Vimeo-Service
3. **Consent-Check**: Consent Manager prüft, ob bereits Consent vorliegt
4. **Platzhalter**: Falls kein Consent, wird Inline-Consent-Placeholder gezeigt
5. **Nach Consent**: Original `<media-player>` wird eingesetzt und abgespielt

### Performance

- ✅ **Caching**: Consent-Entscheidungen werden gecacht
- ✅ **Lazy Loading**: Videos werden erst bei Sichtbarkeit geladen
- ✅ **Minimal JS**: Nur Translation-Support in vidstack_helper.js

## FAQ

### Muss ich den Consent Manager nutzen?

**Nein**, aber empfohlen für DSGVO-Konformität. 

**Mit Consent Manager:**
- ✅ `generateFull()` nutzt automatisch Inline-Consent
- ✅ Videos werden erst nach Einwilligung geladen
- ✅ DSGVO-konform

**Ohne Consent Manager:**
- ⚠️ YouTube/Vimeo-Videos werden **direkt geladen** (ohne Einwilligung)
- ⚠️ Sie sind selbst für Datenschutz verantwortlich
- ℹ️ Nutzen Sie dann `generate()` statt `generateFull()` für lokale Videos

### Funktioniert mein alter Code noch?

**Ja**, alle PHP-Methoden bleiben erhalten:
- `generateFull()` ✅
- `generate()` ✅
- `setPoster()` ✅
- `addSubtitle()` ✅

### Welche Services muss ich im Consent Manager anlegen?

Legen Sie folgende Services an (Consent Manager → Services):

**YouTube:**
- **UID**: `youtube` (genau so, Kleinschreibung!)
- **Service-Name**: YouTube
- **Provider**: Google/YouTube
- **Type**: Video-Plattform

**Vimeo:**
- **UID**: `vimeo` (genau so, Kleinschreibung!)
- **Service-Name**: Vimeo
- **Provider**: Vimeo
- **Type**: Video-Plattform

Die UIDs müssen exakt `youtube` bzw. `vimeo` sein, da Vidstack nach diesen sucht.

### Was ist mit der `generateConsentPlaceholder()` Methode?

**Entfernt** - wird nicht mehr benötigt. Vidstack ruft jetzt direkt `consent_manager_inline::doConsent()` auf.

### Kann ich beide Systeme parallel nutzen?

**Nicht empfohlen**. Nutzen Sie entweder:
- Consent Manager (empfohlen) oder
- Eigenes Consent-System (dann Videos manuell blocken)

### Wie passe ich die Consent-Texte an?

Im **Consent Manager Backend**:
```
Consent Manager → Texte → Inline-Texte bearbeiten
```

5 Theme-Varianten verfügbar:
- Gray (Standard)
- Blue
- Green  
- Compact Gray
- Compact Blue

## Support & Weiterentwicklung

- **Vidstack Issues**: https://github.com/FriendsOfREDAXO/vidstack/issues
- **Consent Manager Issues**: https://github.com/FriendsOfREDAXO/consent_manager/issues
- **Forum**: https://www.redaxo.org/forum/

## Changelog

### Version 2.0.0 (2025-10-17)

**Breaking Changes:**
- ❌ Entfernt: Eigenes Consent-System
- ❌ Entfernt: `generateConsentPlaceholder()` Methode
- ❌ Entfernt: Consent-JavaScript aus `vidstack_helper.js`
- ❌ Entfernt: Consent-CSS aus `vidstack_helper.css`

**Neue Features:**
- ✅ Integration mit Consent Manager AddOn
- ✅ Direkte src-Ausgabe für alle Videos
- ✅ Vereinfachte JavaScript-Logik (nur Translations)

**Migration:**
- ℹ️ PHP-Code bleibt unverändert
- ℹ️ Consent Manager übernimmt Blocking automatisch
- ℹ️ Alte Consent-Cookies werden nicht mehr verwendet

---

**Autoren**: Friends Of REDAXO  
**Lizenz**: MIT  
**Stand**: Oktober 2025
