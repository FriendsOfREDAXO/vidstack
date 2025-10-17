# Vidstack ↔ Consent Manager: Integration Flow

## Überblick

Vidstack nutzt den Consent Manager **direkt** über die `doConsent()` API - **kein** automatisches Scanning via Output-Filter.

## Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────────┐
│                        PHP Backend                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Video-Objekt erstellen                                       │
│     ┌──────────────────────────────────────────┐                │
│     │ $video = new Video('youtube.com/...');   │                │
│     │ $video->setPoster('thumb.jpg');          │                │
│     │ echo $video->generateFull();             │                │
│     └──────────────────┬───────────────────────┘                │
│                        │                                         │
│  2. generateFull() prüft Platform                                │
│     ┌──────────────────▼───────────────────────┐                │
│     │ $videoInfo = getVideoInfo($source);      │                │
│     │ if ($videoInfo['platform'] === 'youtube')│                │
│     │    → Consent Manager Integration         │                │
│     └──────────────────┬───────────────────────┘                │
│                        │                                         │
│  3. Consent Manager Check                                        │
│     ┌──────────────────▼───────────────────────┐                │
│     │ if (class_exists('consent_manager_...')) │                │
│     │    → Consent Manager VERFÜGBAR           │                │
│     │ else                                      │                │
│     │    → Direktes Laden (ohne Consent)       │                │
│     └──────────────────┬───────────────────────┘                │
│                        │                                         │
│  4a. MIT Consent Manager                                         │
│     ┌──────────────────▼───────────────────────┐                │
│     │ $options = [                              │                │
│     │   'title' => $this->title,               │                │
│     │   'thumbnail' => $this->poster['src']    │                │
│     │ ];                                        │                │
│     │                                           │                │
│     │ consent_manager_inline::doConsent(       │                │
│     │   'youtube',     // Service-UID          │                │
│     │   $playerCode,   // <media-player> HTML  │                │
│     │   $options       // Optionen             │                │
│     │ );                                        │                │
│     └──────────────────┬───────────────────────┘                │
│                        │                                         │
│  5. Consent Manager Logik                                        │
│     ┌──────────────────▼───────────────────────┐                │
│     │ has_consent('youtube')?                   │                │
│     │                                           │                │
│     │ ┌─────────────┐      ┌─────────────┐    │                │
│     │ │ JA: Consent │      │ NEIN: Kein  │    │                │
│     │ │ vorhanden   │      │ Consent     │    │                │
│     │ └──────┬──────┘      └──────┬──────┘    │                │
│     │        │                    │            │                │
│     │        ▼                    ▼            │                │
│     │  Gib Original     Gib Placeholder       │                │
│     │  zurück           zurück                │                │
│     └──────────────────┬───────────────────────┘                │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     HTML Output                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  6a. MIT Consent (zugestimmt)                                    │
│     ┌──────────────────────────────────────────┐                │
│     │ <media-player src="youtube/VIDEO_ID">    │                │
│     │   <media-provider></media-provider>      │                │
│     │   <media-video-layout></media-video...>  │                │
│     │ </media-player>                          │                │
│     └──────────────────────────────────────────┘                │
│                                                                   │
│  6b. OHNE Consent (noch nicht zugestimmt)                        │
│     ┌──────────────────────────────────────────┐                │
│     │ <div class="consent-inline-placeholder">  │                │
│     │   <img src="thumb.jpg" />                │                │
│     │   <p>Für YouTube werden Cookies...</p>    │                │
│     │   <button onclick="giveConsent()">       │                │
│     │     Video laden                           │                │
│     │   </button>                               │                │
│     │   <!-- Original Player versteckt -->      │                │
│     │   <media-player style="display:none">... │                │
│     │ </div>                                    │                │
│     └──────────────────────────────────────────┘                │
│                                                                   │
│  6c. OHNE Consent Manager (direkt)                               │
│     ┌──────────────────────────────────────────┐                │
│     │ <media-player src="youtube/VIDEO_ID">    │                │
│     │   <!-- Lädt direkt, KEINE Consent-Abfrage -->              │
│     │ </media-player>                          │                │
│     └──────────────────────────────────────────┘                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Code-Flow im Detail

### 1. Video-Objekt erstellen (Entwickler-Code)

```php
use FriendsOfRedaxo\VidStack\Video;

$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video');
$video->setPoster('vorschau.jpg', 'Vorschaubild');
echo $video->generateFull();
```

### 2. `generateFull()` - Platform-Erkennung

```php
public function generateFull(): string
{
    $videoInfo = self::getVideoInfo($this->source);
    // Result: ['platform' => 'youtube', 'id' => 'dQw4w9WgXcQ']
    
    $isAudio = self::isAudio($this->source);
    $playerCode = $this->generate(); // Generiert <media-player>
    
    // Consent Manager Integration?
    if (!$isAudio && 
        $videoInfo['platform'] !== 'default' && 
        class_exists('consent_manager_inline')) {
        
        // JA → Consent Manager nutzen
        $playerCode = $this->applyConsentManager($videoInfo, $playerCode);
    }
    
    return $playerCode;
}
```

### 3. Consent Manager Integration

```php
private function applyConsentManager($videoInfo, $playerCode): string
{
    $serviceKey = strtolower($videoInfo['platform']); // 'youtube'
    
    $options = [
        'title' => $this->title ?: ucfirst($videoInfo['platform']) . ' Video',
        'width' => 'auto',
        'height' => 'auto',
    ];
    
    // Poster als Thumbnail
    if (!empty($this->poster['src'])) {
        $options['thumbnail'] = $this->poster['src'];
    }
    
    // Consent Manager API-Aufruf
    return consent_manager_inline::doConsent(
        $serviceKey,    // 'youtube' oder 'vimeo'
        $playerCode,    // Original <media-player> HTML
        $options        // Optionen für Placeholder
    );
}
```

### 4. `consent_manager_inline::doConsent()` - Consent-Check

```php
// In consent_manager/lib/consent_manager_inline.php

public static function doConsent($serviceKey, $content, $options = [])
{
    // Service aus DB laden
    $service = self::getService($serviceKey); // SELECT ... WHERE uid = 'youtube'
    
    // Bereits zugestimmt?
    if (consent_manager_util::has_consent($serviceKey)) {
        // JA → Original Content zurückgeben
        return $content; // <media-player> unverändert
    }
    
    // NEIN → Placeholder generieren
    switch (strtolower($serviceKey)) {
        case 'youtube':
            return self::renderYouTubePlaceholder(...);
        case 'vimeo':
            return self::renderVimeoPlaceholder(...);
    }
}
```

### 5. Placeholder-Rendering

```php
private static function renderYouTubePlaceholder($serviceKey, $content, $options, $consentId, $service)
{
    $html = '<div class="consent-inline-placeholder" data-consent-id="'.$consentId.'">';
    
    // Thumbnail
    if (!empty($options['thumbnail'])) {
        $html .= '<img src="'.$options['thumbnail'].'" alt="Video Vorschau" />';
    }
    
    // Consent-Text
    $html .= '<div class="consent-text">';
    $html .= '<p>Für die Anzeige werden Cookies von YouTube benötigt.</p>';
    $html .= '</div>';
    
    // Button
    $html .= '<button type="button" class="consent-button" onclick="giveConsent(\''.$serviceKey.'\', \''.$consentId.'\')">';
    $html .= 'Video laden';
    $html .= '</button>';
    
    // Original Content versteckt speichern
    $html .= '<div class="consent-original-content" style="display:none;">';
    $html .= $content; // <media-player> hier drin
    $html .= '</div>';
    
    $html .= '</div>';
    
    return $html;
}
```

### 6. Frontend - Nach Consent-Klick

```javascript
// consent_manager_frontend.js

function giveConsent(serviceKey, consentId) {
    // Consent speichern (Cookie/DB)
    saveConsent(serviceKey);
    
    // Placeholder finden
    const placeholder = document.querySelector('[data-consent-id="'+consentId+'"]');
    
    // Original Content holen
    const originalContent = placeholder.querySelector('.consent-original-content').innerHTML;
    
    // Ersetzen
    placeholder.outerHTML = originalContent;
    
    // Video lädt jetzt automatisch
}
```

## Service-Konfiguration

Im Consent Manager müssen folgende Services angelegt sein:

### YouTube-Service

```
Consent Manager → Services → Neu

UID:              youtube         ← WICHTIG: Genau so!
Service-Name:     YouTube
Provider:         Google/YouTube
Provider-Link:    https://policies.google.com/privacy
Type:             Video-Plattform
Required:         Nein
```

### Vimeo-Service

```
Consent Manager → Services → Neu

UID:              vimeo          ← WICHTIG: Genau so!
Service-Name:     Vimeo
Provider:         Vimeo
Provider-Link:    https://vimeo.com/privacy
Type:             Video-Plattform
Required:         Nein
```

## Vorteile dieser Integration

### ✅ Direkte API-Integration
- Kein Output-Filter-Parsing nötig
- Klare Kontrollpunkte im Code
- Einfaches Debugging

### ✅ Poster als Thumbnail
- Vidstack-Poster wird automatisch als Consent-Placeholder-Thumbnail genutzt
- Konsistentes Erscheinungsbild

### ✅ Graceful Degradation
- Ohne Consent Manager: Videos laden direkt
- Mit Consent Manager: Automatisches Blocking

### ✅ Performance
- Consent-Check nur bei externen Videos (YouTube/Vimeo)
- Lokale Videos (mp4, etc.) nie geblockt
- Kein unnötiges HTML-Parsing

## Debugging

### Consent Manager verfügbar?

```php
if (class_exists('consent_manager_inline')) {
    echo "Consent Manager verfügbar ✅";
} else {
    echo "Consent Manager NICHT verfügbar ❌";
}
```

### Service vorhanden?

```sql
SELECT * FROM rex_consent_manager_cookie 
WHERE uid = 'youtube' AND clang_id = 1;
```

### Consent vorhanden?

```php
if (consent_manager_util::has_consent('youtube')) {
    echo "Consent für YouTube vorhanden ✅";
} else {
    echo "Kein Consent für YouTube ❌";
}
```

### Debug-Output in `generateFull()`

```php
if (rex::isDebugMode()) {
    echo "<!-- Vidstack Debug:\n";
    echo "Platform: {$videoInfo['platform']}\n";
    echo "Consent Manager: " . (class_exists('consent_manager_inline') ? 'JA' : 'NEIN') . "\n";
    echo "-->";
}
```

## Zusammenfassung

**Frage**: "Woher weiß der Consent Manager was er blocken soll?"

**Antwort**: Vidstack **sagt es ihm direkt**!

```php
// Vidstack ruft explizit auf:
consent_manager_inline::doConsent('youtube', $html, $options);

// Kein automatisches Scanning
// Keine Output-Filter
// Direkte API-Integration ✅
```

---

**Stand**: Oktober 2025  
**Autor**: Friends Of REDAXO
