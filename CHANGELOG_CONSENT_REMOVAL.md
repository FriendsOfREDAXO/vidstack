# Vidstack - Consent Manager Integration entfernt

## Änderungen (Version 2.1.0)

### Entfernte Features

1. **Automatische Consent Manager Integration**
   - ❌ Keine automatische Erkennung von `consent_manager_inline`
   - ❌ Keine Service-Registrierung in `boot.php`
   - ❌ Keine `doConsent()` Aufrufe in `generateFull()`

### Code-Änderungen

**lib/video.php:**
- `generateFull()` generiert jetzt nur noch den Player ohne Consent-Logik
- Alle Consent Manager Checks und `doConsent()` Aufrufe entfernt

**boot.php:**
- Service-Registrierung für `vidstack_youtube` und `vidstack_vimeo` entfernt

**README.md:**
- Consent Manager Automatik-Beschreibung entfernt
- Manuelle Integration als optionales Code-Beispiel hinzugefügt
- Feature-Liste aktualisiert (WCAG 2.1 Level AA Fokus)

### Warum?

1. **Separation of Concerns:** Vidstack = Player, Consent Manager = DSGVO
2. **Mehr Kontrolle:** Entwickler entscheiden selbst, ob/wie Consent Manager genutzt wird
3. **Weniger Komplexität:** Keine versteckten Abhängigkeiten
4. **Bessere Testbarkeit:** Player-Code unabhängig testbar

### Migration

**Vorher (v2.0 - Automatisch):**
```php
// YouTube wurde automatisch mit Consent Manager geblackt
echo Video::youtube('...', 'Titel')->generateFull();
```

**Nachher (v2.1 - Manuell):**
```php
// Option 1: Ohne Consent Manager (direkt laden)
echo Video::youtube('...', 'Titel')->generateFull();

// Option 2: Mit Consent Manager (manuell)
$playerCode = Video::youtube('...', 'Titel')->generate();
if (class_exists('consent_manager_inline')) {
    // WICHTIG: Verwende eigene UID (z.B. 'vidstack_youtube')
    // NICHT 'youtube' verwenden, sonst generiert Consent Manager ein Standard-iframe!
    echo consent_manager_inline::doConsent('vidstack_youtube', $playerCode, [
        'title' => 'Video',
        'thumbnail' => 'thumb.jpg'
    ]);
} else {
    echo '<div class="video-container">' . $playerCode . '</div>';
}
```

**Consent Manager Setup:**
- Service-UID: `vidstack_youtube` (nicht `youtube`!)
- Service-UID: `vidstack_vimeo` (nicht `vimeo`!)
- Cookie-Typ: `youtube` oder `vimeo` (für Gruppierung)
- Domains: Entsprechende Plattform-Domains

### Vorteile

✅ Einfacherer Code  
✅ Keine versteckten Abhängigkeiten  
✅ Volle Kontrolle über Consent-Logik  
✅ Bessere Performance (keine Class-Checks)  
✅ Flexibler für andere Consent-Lösungen  

### Dokumentation

- Manuelle Integration in README.md erklärt
- CONSENT_MANAGER_INTEGRATION.md veraltet (kann gelöscht werden)
- INTEGRATION_FLOW.md veraltet (kann gelöscht werden)

