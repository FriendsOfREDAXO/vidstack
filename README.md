# vidstack for REDAXO

## Übersicht

Diese PHP-Klasse ermöglicht die einfache Integration von VidStack in die Webseite. Sie unterstützt YouTube, Vimeo und lokale Videos mit erweiterten Funktionen wie Barrierefreiheit, Mehrsprachigkeit und Consent-Management.

## Installation

1. Kopieren Sie die `Video.php` Datei in Ihr Projekt.
2. Stellen Sie sicher, dass die `translations.php` Datei im gleichen Verzeichnis liegt.

## Grundlegende Verwendung

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// YouTube-Video einbinden
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Beispiel-Video');
echo $video->generateFull();

// Vimeo-Video einbinden
$vimeoVideo = new Video('https://vimeo.com/148751763', 'Vimeo-Beispiel');
echo $vimeoVideo->generateFull();

// Lokales Video einbinden
$localVideo = new Video('/pfad/zum/video.mp4', 'Lokales Video');
echo $localVideo->generate();
```

## Methoden

### Konstruktor

```php
__construct($source, $title = '', $lang = 'de')
```
- `$source`: URL oder Pfad zum Video
- `$title`: Titel des Videos (optional)
- `$lang`: Sprachcode (de, en, es, sl, fr) - Standard ist Deutsch

### Weitere Methoden

- `setAttributes(array $attributes)`: Fügt zusätzliche Attribute zum Video-Player hinzu.
- `setA11yContent($description, $alternativeUrl = '')`: Fügt Beschreibung und alternativen Link für Barrierefreiheit hinzu.
- `setThumbnails($thumbnailsUrl)`: Setzt ein benutzerdefiniertes Vorschaubild.
- `addSubtitle($src, $kind, $label, $lang, $default = false)`: Fügt Untertitel hinzu.
- `generateFull()`: Generiert vollständigen HTML-Code mit Consent-Mechanismus und Barrierefreiheits-Features.
- `generate()`: Generiert einfachen Video-Player ohne zusätzliche Funktionen.

## 🌍 Mehrsprachigkeit

Unser Video-Player spricht mehr Sprachen als ein UNO-Dolmetscher! Aktuell unterstützen wir:
- Deutsch (de)
- Englisch (en)
- Spanisch (es)
- Slowenisch (sl)
- Französisch (fr)

Um die Sprache zu ändern, geben Sie einfach den entsprechenden Code beim Erstellen des Video-Objekts an:

```php
$videoES = new Video('https://www.youtube.com/watch?v=example', 'Mi Video', 'es');
```

## Vollständiges Beispiel

Hier ist ein Beispiel, das die meisten Funktionen der Video-Klasse demonstriert:

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// Initialisierung des Video-Objekts
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Ausführliches Beispiel-Video', 'de');

// Setzen von Player-Attributen
$video->setAttributes([
    'autoplay' => false,
    'muted' => false,
    'loop' => false,
    'playsinline' => true,
    'crossorigin' => 'anonymous',
    'poster' => '/pfad/zum/poster.jpg'
]);

// Hinzufügen von Barrierefreiheits-Inhalten
$video->setA11yContent(
    'Dieses Video zeigt eine Beispiel-Präsentation über moderne Webentwicklung.',
    'https://example.com/alternative-version'
);

// Setzen von Thumbnail-Vorschaubildern für den Player-Fortschritt
$video->setThumbnails('/pfad/zu/thumbnails.vtt');

// Hinzufügen von Untertiteln in verschiedenen Sprachen
$video->addSubtitle('/untertitel/deutsch.vtt', 'captions', 'Deutsch', 'de', true);
$video->addSubtitle('/untertitel/english.vtt', 'captions', 'English', 'en');
$video->addSubtitle('/untertitel/francais.vtt', 'captions', 'Français', 'fr');

// Generieren des vollständigen Video-Player-Codes
$fullPlayerCode = $video->generateFull();

// Ausgabe des generierten Codes
echo $fullPlayerCode;
```

Dieses Beispiel zeigt:
1. Initialisierung eines YouTube-Videos mit Titel und Spracheinstellung
2. Setzen verschiedener Player-Attribute
3. Hinzufügen von Barrierefreiheits-Inhalten mit Beschreibung und alternativem Link
4. Festlegen eines benutzerdefinierten Vorschaubildes
5. Hinzufügen von Untertiteln in mehreren Sprachen
6. Generierung des vollständigen Player-Codes mit allen Funktionen

## Fazit

Jetzt sind Sie ein Video-Einbettungs-Ninja! Gehen Sie hinaus und machen Sie das Internet zu einem besseren Ort - ein Video nach dem anderen. Und denken Sie daran: Mit großer Macht kommt große Verantwortung (und coole Videos)!

Viel Spaß beim Coden! 🚀👩‍💻👨‍💻
