# VidStack for REDAXO

## Was ist das hier?

Eine PHP-Klasse, die Videos auf Websites einbindet - mit Style! YouTube, Vimeo oder eigene Videos? Alles kein Problem. Und das Beste? Es ist so einfach zu benutzen, dass selbst ein Kater es könnte (wenn er Daumen hätte).

## 🚀 Los geht's!

### Installation

Klar, natürlich über den REDAXO-Installer oder als GitHub Release. 

Nun ja. Das war nicht alles: 

#### Für das Frontend: 

Im Frontend müssen noch die CSS und JS eingebunden werden. 

vidstack.js
vidstack_helper.js

vidstack.css
vidstack_helper.css

Die helper braucht man für die `generateFull()`-Methode ... mit dem ganzen Brimborium und DSGVO und so ... ach ja ... 
Wer nur `generate()` verwendendet, viel Spaß ohne. Denn die ``generate()` liefert keine Consent-Abfrage oder zusätzliche Infos für die Besucher. 

Alles findet sich natürlich im Assets-Ordner. 

### Grundlegende Verwendung

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// YouTube-Video
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Never Gonna Give You Up');
echo $video->generateFull();

// Vimeo-Video
$vimeoVideo = new Video('https://vimeo.com/148751763', 'Vimeo-Beispiel');
echo $vimeoVideo->generateFull();

// Lokales Video
$localVideo = new Video('/pfad/zum/video.mp4', 'Eigenes Video');
echo $localVideo->generate();
```

## 🛠 Die Methoden

### Konstruktor
```php
__construct($source, $title = '', $lang = 'de')
```
- `$source`: URL oder Pfad zum Video (Pflicht)
- `$title`: Titel des Videos (Optional)
- `$lang`: Sprachcode (Optional, Standard: 'de')

### Weitere Methoden

- `setAttributes(array $attributes)`: Zusätzliche Player-Attribute
- `setA11yContent($description, $alternativeUrl = '')`: Barrierefreiheits-Infos
- `setThumbnails($thumbnailsUrl)`: Thumbnail-Vorschaubilder (VTT-Format)
- `addSubtitle($src, $kind, $label, $lang, $default = false)`: Untertitel hinzufügen
- `generateFull()`: Vollständiger HTML-Code mit allen Schikanen
- `generate()`: Einfacher Video-Player ohne Schnickschnack

## 📋 Optionen und Pflichtangaben

### Pflichtangaben
- `$source` beim Erstellen des Video-Objekts

### Optionale Angaben
- `$title` beim Erstellen des Video-Objekts
- `$lang` beim Erstellen des Video-Objekts
- Alle Attribute in `setAttributes()`
- Beschreibung und alternativer URL in `setA11yContent()`
- Thumbnail-URL in `setThumbnails()`
- Untertitel-Informationen in `addSubtitle()`

## 🌍 Sprachenwirrwarr

Der Video-Player spricht mehr Sprachen als ein UNO-Dolmetscher! Aktuell im Repertoire:
- Deutsch (de)
- Englisch (en)
- Spanisch (es)
- Slowenisch (si)
- Französisch (fr)

Sprachänderung leicht gemacht:

```php
$videoES = new Video('https://www.youtube.com/watch?v=example', 'Mi Video', 'es');
```

## 🎭 Beispiele für die Dramaturgen

### Ein YouTube-Video mit vollem Programm

```php
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Never Gonna Give You Up', 'en');
$video->setAttributes(['autoplay' => true, 'muted' => true]);
$video->setA11yContent('This is a music video by Rick Astley');
$video->setThumbnails('/pfad/zu/thumbnails.vtt');
$video->addSubtitle('/untertitel/deutsch.vtt', 'captions', 'Deutsch', 'de', true);
$video->addSubtitle('/untertitel/english.vtt', 'captions', 'English', 'en');
echo $video->generateFull();
```

### Ein schlichtes lokales Video

```php
$video = new Video('/pfad/zu/katzen_spielen_schach.mp4', 'Schachgenies');
echo $video->generate();
```

### Vimeo mit Custom Thumbnails und Untertiteln

```php
$video = new Video('https://vimeo.com/148751763', 'Vimeo-Meisterwerk', 'fr');
$video->setThumbnails('/vimeo_thumbs.vtt');
$video->addSubtitle('/sous-titres.vtt', 'captions', 'Français', 'fr', true);
echo $video->generateFull();
```

### 🌟 Full Featured Beispiel

Hier kommt der Königsklasse-Einsatz - alle Funktionen auf einmal:

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// Initialisierung des Video-Objekts
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Ultimate Rickroll Experience', 'en');

// Setzen aller möglichen Player-Attribute
$video->setAttributes([
    'autoplay' => false,
    'muted' => false,
    'loop' => true,
    'playsinline' => true,
    'crossorigin' => 'anonymous',
    'poster' => '/pfad/zum/poster.jpg',
    'preload' => 'metadata',
    'controlsList' => 'nodownload',
    'class' => 'my-custom-video-class',
    'data-custom' => 'some-value'
]);

// Hinzufügen von ausführlichen Barrierefreiheits-Inhalten
$video->setA11yContent(
    'This legendary music video features Rick Astley performing "Never Gonna Give You Up". The video begins with Rick, dressed in a black leather jacket, dancing in various locations. The catchy synth-pop tune and Rick\'s distinctive baritone voice have made this song an internet phenomenon.',
    'https://example.com/detailed-audio-description'
);

// Setzen von Thumbnail-Vorschaubildern für den Player-Fortschritt
$video->setThumbnails('/pfad/zu/detailed-thumbnails.vtt');

// Hinzufügen von Untertiteln in mehreren Sprachen
$video->addSubtitle('/untertitel/english.vtt', 'captions', 'English', 'en', true);
$video->addSubtitle('/untertitel/deutsch.vtt', 'captions', 'Deutsch', 'de');
$video->addSubtitle('/untertitel/francais.vtt', 'captions', 'Français', 'fr');
$video->addSubtitle('/untertitel/espanol.vtt', 'captions', 'Español', 'es');
$video->addSubtitle('/untertitel/slovenscina.vtt', 'captions', 'Slovenščina', 'si');

// Hinzufügen von Audiodeskription
$video->addSubtitle('/audio/description.vtt', 'descriptions', 'Audio Description', 'en');

// Hinzufügen von Kapitelmarkierungen
$video->addSubtitle('/chapters/rickroll.vtt', 'chapters', 'Chapters', 'en');

// Generieren des vollständigen Video-Player-Codes
$fullPlayerCode = $video->generateFull();

// Ausgabe des generierten Codes
echo $fullPlayerCode;
```

Dieses Beispiel zeigt:
1. Initialisierung eines YouTube-Videos mit Titel und englischer Spracheinstellung
2. Setzen aller möglichen Player-Attribute, einschließlich benutzerdefinierter Klassen und Datenattribute
3. Hinzufügen von ausführlichen Barrierefreiheits-Inhalten mit detaillierter Beschreibung und alternativem Link
4. Festlegen von Thumbnail-Vorschaubildern für den Player-Fortschritt im VTT-Format
5. Hinzufügen von Untertiteln in allen unterstützten Sprachen
6. Einbindung von Audiodeskription für Sehbehinderte
7. Hinzufügen von Kapitelmarkierungen für einfache Navigation
8. Generierung des vollständigen Player-Codes mit allen Funktionen

Mit diesem Setup ist der Video-Player bereit, die Welt zu erobern - oder zumindest jedem Zuschauer ein Lächeln ins Gesicht zu zaubern!

## 🧙‍♂️ Die magische Default-Funktion

Wer faul clever ist, baut sich eine Hilfsfunktion für Standardeinstellungen:

```php
function createDefaultVideo($source, $title = '', $lang = 'de') {
    $video = new Video($source, $title, $lang);
    $video->setAttributes([
        'autoplay' => false,
        'muted' => true,
        'playsinline' => true
    ]);
    $video->setA11yContent('Ein fantastisches Video über...');
    return $video;
}

// Verwendung
$easyVideo = createDefaultVideo('https://youtube.com/watch?v=abcdefg', 'Einfach Genial');
echo $easyVideo->generateFull();
```

🍪 Consent und Kekse

Leider muss es ja sein. 

Hiermit kann man in einem Consent-Manager oder auch so mal zwischendurch die Erlaubnis für Vimeo oder Youtube setzen. Wer keine Cookies erlaubt bekommt halt Local-Storage 😉.

```js
<script>
// YouTube
(()=>{let v=JSON.parse(localStorage.getItem('video_consent')||'{}');v.youtube=true;localStorage.setItem('video_consent',JSON.stringify(v));document.cookie='youtube_consent=true; path=/; max-age=2592000; SameSite=Lax; Secure';})();

// Für Vimeo:
(()=>{let v=JSON.parse(localStorage.getItem('video_consent')||'{}');v.vimeo=true;localStorage.setItem('video_consent',JSON.stringify(v));document.cookie='vimeo_consent=true; path=/; max-age=2592000; SameSite=Lax; Secure';})();
</script>
```


## 🎉 HEUREKA!

Jetzt bist du ein Video-Einbettungs-Ninja! Geh raus und mache das Internet zu einem besseren Ort - ein Video nach dem anderen. Und denk dran: Mit großer Macht kommt große Verantwortung (und coole Videos)!

Viel Spaß beim Coden! 🚀👩‍💻👨‍💻

## 👓 Für die DEVs, Nerds und Geeks

Ihr wollt uns sicher mal bei der Weiterentwicklung helfen. Das geht so: 

### Den Vendor aktualisieren und ein frisches Build erstellen

Im Ordner build ist alles drin was man braucht. 
- Also forken, lokal runterladen. 
- npm install ausführen
- npm npm run build ausführen
- vidstack.js und vistack.css im Assets-Ordner austauschen 
PR erstellen 😀

### Alles andere

…fliegt hier so im Repo rum, Einfach mal reinschauen. 


## Autor(en)

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO
* Ein bisschen KI 😎


**Projektleitung**

[Thomas Skerbis](https://github.com/skerbis)

