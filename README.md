# 🎬 Vidstack für REDAXO# [Vidstack.io](https://www.vidstack.io) für REDAXO# [Vidstack.io](https://www.vidstack.io) für REDAXO# [Vidstack.io](https://www.vidstack.io) for REDAXO



![Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/screenshot.png?raw=true) 



**Vorhang auf für den modernsten Video-Player im REDAXO-Universum!**![Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/screenshot.png?raw=true)



Vidstack bringt YouTube, Vimeo und lokale Videos mit Style auf deine Website. Barrierefreie Controls, DSGVO-konform dank Consent Manager und so einfach zu bedienen, dass selbst der Praktikant damit klarkommt.



---Eine moderne PHP-Klasse für elegante Video-Einbindung: YouTube, Vimeo, lokale Videos - alles mit einem schönen Player und DSGVO-konform dank Consent Manager Integration.![Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/screenshot.png?raw=true)![Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/screenshot.png?raw=true)



## 🍿 Was ist das hier?



Ein REDAXO-AddOn, das [Vidstack.io](https://www.vidstack.io) in eine elegante PHP-Klasse verpackt. Du gibst eine URL ein, wir zaubern einen vollwertigen Video-Player. Mit Untertiteln, Kapiteln, Thumbnails und allem Schnickschnack, den das Kino-Herz begehrt.---



**Die Highlights:**

- 🎯 **Einfache API**: Factory Methods und Fluent Interface für cleanen Code

- 🌍 **Multi-Platform**: YouTube, Vimeo, lokale Videos, HLS, DASH## 🚀 SchnellstartEine moderne PHP-Klasse für elegante Video-Einbindung: YouTube, Vimeo, lokale Videos - alles mit einem schönen Player und DSGVO-konform dank Consent Manager Integration.## Was ist das hier?

- ♿ **Barrierefrei**: WCAG 2.1 AA konform

- 🔒 **DSGVO**: Automatische Consent Manager Integration

- 📱 **Responsive**: Passt sich allen Bildschirmen an

- ⚡ **Performance**: Smart Loading Strategies### Installation



---



## 🚀 SchnellstartVia REDAXO-Installer oder als GitHub Release.---Eine PHP-Klasse, die Videos auf Websites einbindet - mit Style! YouTube, Vimeo oder eigene Videos? Alles kein Problem. Und das Beste? Es ist so einfach zu benutzen, dass selbst ein Kater es könnte (wenn er Daumen hätte).



### 1. Installation



Wie immer: REDAXO Installer → AddOns → Vidstack installieren. Oder GitHub Release runterladen und entpacken.### Frontend-Integration



### 2. Assets einbinden



Im Template (am besten im `<head>` oder vor `</body>`):```php## 🚀 Schnellstart## 🌟 Neue Features (Phase 1)



```php// Im Template <head> oder vor </body>:

// CSS

echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack.css') . '">';

echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';

// CSS

// JavaScript

echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack.js') . '"></script>';echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack.css') . '">';### InstallationDas Addon wurde massiv vereinfacht und modernisiert:

echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';

```echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';



### 3. Erstes Video einbinden



```php// JavaScript

use FriendsOfRedaxo\VidStack\Video;

echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack.js') . '"></script>';Via REDAXO-Installer oder als GitHub Release.### ⛓️ Fluent Interface - Sauberer Code durch Method Chaining

// YouTube

echo Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Never Gonna Give You Up')->generateFull();echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';



// Lokales Video```Alle Methoden geben `$this` zurück, was elegantes Chaining ermöglicht:

echo Video::local('video.mp4', 'Mein Video')->setPoster('thumb.jpg')->generateFull();

```



**Das war's!** 🎉---### Frontend-Integration



---



## 🎯 Einfache Beispiele## 🎯 Die neue API (v2.0+)```php



### YouTube-Video mit Autoplay



```php### Factory Methods - Der einfache Einstieg```php$video = Video::local('video.mp4', 'Tutorial')

$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')

    ->autoplay()

    ->loop();

    ```php// Im Template <head> oder vor </body>:    ->setPoster('thumb.jpg')

echo $video->generateFull();

```use FriendsOfRedaxo\VidStack\Video;



**Hinweis:** Consent Manager blockiert YouTube automatisch (DSGVO) - siehe unten!    ->setAspectRatio('16/9')



### Lokales Video mit Poster// YouTube (automatische URL-Erkennung + Consent Manager Integration)



```php$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')// CSS    ->addChapters('chapters.vtt')

$video = Video::local('produkt.mp4', 'Produktvideo')

    ->setPoster('preview.jpg')    ->autoplay()

    ->setAspectRatio('16/9');

        ->loop();echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack.css') . '">';    ->enableResume();

echo $video->generateFull();

```echo $video->generateFull();



### Video mit Untertitelnecho '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';```



```php// Vimeo

$video = Video::local('film.mp4', 'Der große Film')

    ->setPoster('poster.jpg')$video = Video::vimeo('https://vimeo.com/148751763', 'Mein Vimeo Video')

    ->addCaptions('deutsch.vtt', 'Deutsch', true)

    ->addCaptions('english.vtt', 'English');    ->setPoster('vorschau.jpg');

    

echo $video->generateFull();echo $video->generateFull();// JavaScript### 🏭 Factory-Methoden - Weniger Boilerplate

```



### Tutorial-Video mit Kapitel-Navigation

// Lokales Video (mit Smart Defaults: playsInline, preload)echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack.js') . '"></script>';```php

```php

$video = Video::tutorial('tutorial.mp4', 'REDAXO für Anfänger')$video = Video::local('video.mp4', 'Mein Video')

    ->setPoster('thumb.jpg')

    ->addChapters('chapters.vtt')    ->setPoster('thumb.jpg')echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';Video::youtube($url, $title)   // YouTube mit Smart Defaults

    ->enableResume(); // Merkt sich die Position!

        ->setAspectRatio('16/9')

echo $video->generateFull();

```    ->addCaptions('subtitles.vtt');```Video::vimeo($url, $title)     // Vimeo optimiert



**chapters.vtt Beispiel:**echo $video->generateFull();

```vtt

WEBVTTVideo::local($filename, $title) // Lokale Videos mit playsInline



00:00:00.000 --> 00:01:30.000// Tutorial-Video (mit automatischer Resume-Funktion)

Intro

$video = Video::tutorial('tutorial.mp4', 'REDAXO Tutorial')---Video::tutorial($source, $title) // Mit Resume-Funktion

00:01:30.000 --> 00:05:00.000

Installation    ->setPoster('thumb.jpg')



00:05:00.000 --> 00:10:00.000    ->addChapters('kapitel.vtt')```

Erste Schritte

```    ->enableResume();



---echo $video->generateFull();## 🎯 Die neue API (v2.0+)



## 🔒 DSGVO & Consent Manager```



### Automatische Consent-Integration### 📐 Aspect Ratio - Verhindert Layout-Shift



Ab v2.0 nutzt Vidstack automatisch den [Consent Manager](https://github.com/FriendsOfREDAXO/consent_manager):### Fluent Interface - Method Chaining



```php### Factory Methods - Der einfache Einstieg```php

// YouTube wird automatisch geblockt bis zur Einwilligung

$video = Video::youtube('https://youtube.com/watch?v=xyz', 'Trailer')Alle Methoden geben `$this` zurück → elegantes Chaining:

    ->setPoster('preview.jpg'); // Wird als Platzhalter genutzt

    $video->setAspectRatio('16/9');  // Auch: '4/3', '21/9', '1/1'

echo $video->generateFull();

``````php



**Was passiert:**$video = Video::local('produkt.mp4', 'Produktvideo')```php```

1. ✅ Vidstack erkennt YouTube/Vimeo automatisch

2. ✅ Consent Manager zeigt Platzhalter mit Einwilligungsbutton    ->setPoster('preview.jpg', 'Produktvorschau')

3. ✅ Poster-Bild wird als Thumbnail verwendet

4. ✅ Nach Klick auf "Zustimmen": Video lädt    ->setAspectRatio('16/9')use FriendsOfRedaxo\VidStack\Video;



### Setup Consent Manager    ->setLoadStrategy('visible')



Im Consent Manager müssen diese Services angelegt sein:    ->addChapters('chapters.vtt')### ⚡ Loading Strategy - Performance-Optimierung

- Service-UID: `youtube` für YouTube-Videos

- Service-UID: `vimeo` für Vimeo-Videos    ->addCaptions('de.vtt', 'Deutsch', true)



### Ohne Consent Manager?    ->addCaptions('en.vtt', 'English')// YouTube (automatische URL-Erkennung + Consent Manager Integration)```php



Kein Problem! Videos werden dann direkt geladen. Du bist aber selbst für DSGVO-Konformität verantwortlich.    ->autoplay()



---    ->muted();$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')$video->setLoadStrategy('idle');  



## 🎪 Erweiterte Beispieleecho $video->generateFull();



### Barrierefreies Video (A11y)```    ->autoplay()// 'eager' → Sofort laden



```php

$video = Video::local('erklaervideo.mp4', 'Wie funktioniert REDAXO?')

    ->setPoster('poster.jpg')---    ->loop();// 'idle' → Laden wenn Browser idle

    ->addCaptions('de.vtt', 'Deutsch', true)

    ->addCaptions('en.vtt', 'English')

    ->setA11yContent('

        <h3>Inhalt des Videos</h3>## 🌟 Neue Features in v2.0echo $video->generateFull();// 'visible' → Laden wenn sichtbar (Standard)

        <p>In diesem Video zeigen wir dir die Grundlagen von REDAXO CMS.</p>

        <ul>

            <li>Installation (0:00 - 2:30)</li>

            <li>Backend-Tour (2:30 - 5:00)</li>### 1️⃣ Aspect Ratio - Verhindert Layout Shift// 'play' → Erst beim Abspielen laden

            <li>Erste Seite erstellen (5:00 - 8:00)</li>

        </ul>

    ');

    ```php// Vimeo```

echo $video->generateFull();

```$video = Video::local('video.mp4')



### Video mit Performance-Optimierung    ->setAspectRatio('16/9');  // Standard Breitbild$video = Video::vimeo('https://vimeo.com/148751763', 'Mein Vimeo Video')



```php

$video = Video::local('heavy-video.mp4', 'Heavy Video')

    ->setPoster('poster.jpg')// Weitere Optionen:    ->setPoster('vorschau.jpg');### 💾 Resume - Position automatisch merken

    ->setAspectRatio('16/9')        // Verhindert Layout Shift

    ->setLoadStrategy('visible');    // Lädt erst wenn sichtbar->setAspectRatio('4/3')   // Klassisch

    

echo $video->generateFull();->setAspectRatio('21/9')  // Ultrawide/Kinoecho $video->generateFull();```php

```

->setAspectRatio('1/1')   // Quadratisch (Instagram)

**Loading Strategien:**

- `eager` - Sofort laden (Above the Fold)```$video->enableResume();              // Auto Storage-Key

- `idle` - Laden wenn Browser idle ist

- `visible` - Laden wenn Video sichtbar (Standard)

- `play` - Erst beim Abspielen laden

**Vorteil:** Verhindert Cumulative Layout Shift (CLS), bessere Core Web Vitals!// Lokales Video (mit Smart Defaults: playsInline, preload)$video->enableResume('mein-tutorial'); // Custom Key

### Multi-Resolution für Desktop/Mobile



```php

$video = Video::local('video.mp4', 'Responsive Video')### 2️⃣ Loading Strategy - Performance-Optimierung$video = Video::local('video.mp4', 'Mein Video')```

    ->setResponsiveSourcesWithPresets(

        'video-1080p.mp4',  // Desktop

        'video-480p.mp4',   // Mobile

        '1080p',```php    ->setPoster('thumb.jpg')

        'mobile_sd'

    )$video = Video::local('video.mp4')

    ->setPoster('preview.jpg');

        ->setLoadStrategy('idle');    ->setAspectRatio('16/9')### 📑 Chapters & Captions - Vereinfacht

echo $video->generateFull();

```



**Verfügbare Presets:**// Strategien:    ->addCaptions('subtitles.vtt');```php

- `4k`, `2k`, `1080p`, `720p`, `480p`

- `mobile_hd` (960×540), `mobile_sd` (640×360)->setLoadStrategy('eager')    // Sofort laden



### Auto-Detection mehrerer Auflösungen->setLoadStrategy('idle')     // Laden wenn Browser idleecho $video->generateFull();$video->addChapters('chapters.vtt');         // Kapitel-Navigation



```php->setLoadStrategy('visible')  // Laden wenn sichtbar (Standard)

$video = Video::local('video.mp4', 'Multi-Quality');

->setLoadStrategy('play')     // Erst beim Abspielen laden$video->addCaptions('subtitles.vtt');        // Standard-Untertitel

// Sucht automatisch nach:

// - video-1080p.mp4```

// - video-720p.mp4  

// - video-480p.mp4// Tutorial-Video (mit automatischer Resume-Funktion)$video->addCaptions('de.vtt', 'Deutsch', true); // Mit Label

if ($video->createAutoSources('video')) {

    echo $video->generateFull();**Vorteil:** Optimiert Page Load, reduziert initiale Bandwidth!

}

```$video = Video::tutorial('tutorial.mp4', 'REDAXO Tutorial')```



### Audio-Player### 3️⃣ Resume Support - Position merken



```php    ->setPoster('thumb.jpg')

$audio = Video::local('podcast.mp3', 'Podcast Episode 42')

    ->setAttribute('audio', true);```php

    

echo $audio->generateFull();// Automatischer Storage-Key    ->addChapters('kapitel.vtt')### 🎬 Convenience-Methoden

```

$video = Video::tutorial('tutorial.mp4')

---

    ->enableResume();    ->enableResume();```php

## 🎬 Die neue API (v2.0)



### Factory Methods - Weniger Tippen, mehr Film

// Custom Storage-Key (für mehrere Videos)echo $video->generateFull();$video->autoplay();  // Autoplay mit Mute

```php

// YouTube$video = Video::local('lesson-01.mp4')

Video::youtube($url, $title)

    ->enableResume('kurs-lesson-01');```$video->loop();      // Endlos-Schleife

// Vimeo

Video::vimeo($url, $title)```



// Lokales Video mit Smart Defaults$video->muted();     // Stumm schalten

Video::local($filename, $title)

**Vorteil:** User kann Video fortsetzen wo aufgehört - perfekt für Tutorials!

// Tutorial mit Auto-Resume

Video::tutorial($source, $title)### Fluent Interface - Method Chaining```

```

### 4️⃣ Chapters - Kapitel-Navigation

**Smart Defaults:**

- `playsInline="true"` für Mobile

- `preload="metadata"` für Performance

- `enableResume()` bei `tutorial()````php



### Fluent Interface - Verketten wie im Kino$video = Video::local('long-video.mp4')Alle Methoden geben `$this` zurück → elegantes Chaining:### 🎯 Smart Defaults



Alle Methoden geben `$this` zurück:    ->addChapters('chapters.vtt');



```php```Das Addon setzt automatisch sinnvolle Standardwerte:

$video = Video::local('trailer.mp4', 'Blockbuster Trailer')

    ->setPoster('poster.jpg')

    ->setAspectRatio('21/9')

    ->setLoadStrategy('idle')**chapters.vtt Beispiel:**```php- `playsInline="true"` für Mobile

    ->addChapters('chapters.vtt')

    ->addCaptions('de.vtt', 'Deutsch', true)```vtt

    ->addCaptions('en.vtt', 'English')

    ->autoplay()WEBVTT$video = Video::local('produkt.mp4', 'Produktvideo')- `preload="metadata"` für Performance

    ->muted();

    

echo $video->generateFull();

```00:00:00.000 --> 00:01:30.000    ->setPoster('preview.jpg', 'Produktvorschau')



### Neue Convenience MethodsEinleitung



```php    ->setAspectRatio('16/9')## 🚀 Los geht's!

// Autoplay (mit Mute, wegen Browser-Policies)

$video->autoplay();00:01:30.000 --> 00:05:00.000



// Endlos-SchleifeHauptteil    ->setLoadStrategy('visible')

$video->loop();



// Stumm schalten

$video->muted();00:05:00.000 --> 00:07:00.000    ->addChapters('chapters.vtt')### Installation



// Kapitel (vereinfacht)Zusammenfassung

$video->addChapters('chapters.vtt');

```    ->addCaptions('de.vtt', 'Deutsch', true)

// Untertitel (vereinfacht)

$video->addCaptions('subtitles.vtt', 'Deutsch', true);

```

### 5️⃣ Convenience Methods    ->addCaptions('en.vtt', 'English')Klar, natürlich über den REDAXO-Installer oder als GitHub Release. Aber das war's noch nicht ganz:

### Aspect Ratio - Verhindert Layout Shift



```php

$video->setAspectRatio('16/9');  // Standard```php    ->autoplay()

$video->setAspectRatio('4/3');   // Klassisch

$video->setAspectRatio('21/9');  // Kino$video = Video::youtube('https://youtube.com/watch?v=xyz')

$video->setAspectRatio('1/1');   // Instagram

```    ->autoplay()     // Autoplay mit Mute (Browser-konform)    ->muted();#### Für das Frontend:



**Vorteil:** Google Core Web Vitals lieben dich dafür!    ->loop()         // Endlos-Schleife



### Resume-Funktion - Position merken    ->muted();       // Stumm schaltenecho $video->generateFull();



```php

// Auto Storage-Key

$video->enableResume();// Untertitel vereinfacht```Jetzt kommt der interessante Teil - wir müssen noch ein paar Dateien in unser Frontend einbinden, damit der ganze Zauber funktioniert. Hier ist, was du brauchst:



// Custom Key für mehrere Videos$video->addCaptions('subtitles.vtt');                    // Einfach

$video->enableResume('tutorial-teil-1');

```$video->addCaptions('de.vtt', 'Deutsch', true);         // Mit Label + Default



**Nutzen:** User kann Video später genau da weiterschauen, wo aufgehört wurde.```



------```php



## 📚 API-Referenz---



### ✨ Neue API (v2.0) - Empfohlen!// In deinem Template oder an einer anderen passenden Stelle:



#### Factory Methods## 📚 Alle Methoden



| Methode | Was macht die? |## 🌟 Neue Features in v2.0

|---------|----------------|

| `Video::youtube($url, $title)` | YouTube mit Consent Manager |### ✨ Factory Methods (NEU)

| `Video::vimeo($url, $title)` | Vimeo mit Consent Manager |

| `Video::local($filename, $title)` | Lokales Video, optimiert |// CSS einbinden

| `Video::tutorial($source, $title)` | Mit Resume-Funktion |

| Methode | Beschreibung |

#### Phase 1 Features

|---------|--------------|### 1️⃣ Aspect Ratio - Verhindert Layout Shiftecho '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack.css') . '">';

| Methode | Parameter | Beschreibung |

|---------|-----------|--------------|| `Video::youtube($url, $title)` | YouTube mit Consent Manager Integration |

| `setAspectRatio()` | `'16/9'`, `'4/3'`, `'21/9'`, `'1/1'` | Layout Shift vermeiden |

| `setLoadStrategy()` | `'eager'`, `'idle'`, `'visible'`, `'play'` | Performance tunen || `Video::vimeo($url, $title)` | Vimeo mit Consent Manager Integration |echo '<link rel="stylesheet" href="' . rex_url::addonAssets('vidstack', 'vidstack_helper.css') . '">';

| `enableResume()` | `?string $key` | Position speichern |

| `addChapters()` | `string $vttFile` | Kapitel hinzufügen || `Video::local($filename, $title)` | Lokales Video mit Smart Defaults |

| `addCaptions()` | `string $vtt, string $label, bool $default` | Untertitel easy |

| `autoplay()` | - | Autoplay mit Mute || `Video::tutorial($source, $title)` | Mit automatischer Resume-Funktion |```php

| `loop()` | - | Endlos-Schleife |

| `muted()` | `bool $muted` | Ton aus |



#### Basis-Methoden### ⚡ Phase 1 Features (NEU)$video = Video::local('video.mp4')// JavaScript einbinden



| Methode | Was macht die? |

|---------|----------------|

| `setPoster($src, $alt)` | Vorschaubild setzen || Methode | Parameter | Beschreibung |    ->setAspectRatio('16/9');  // Standard Breitbildecho '<script src="' . rex_url::addonAssets('vidstack', 'vidstack.js') . '"></script>';

| `setThumbnails($url)` | Thumbnail-Sprites (VTT) |

| `setAttributes($array)` | HTML-Attribute setzen ||---------|-----------|--------------|

| `setAttribute($key, $value)` | Einzelnes Attribut |

| `setA11yContent($content)` | Barrierefreie Infos || `setAspectRatio()` | `'16/9'`, `'4/3'`, `'21/9'`, `'1/1'` | Verhindert Layout Shift |echo '<script src="' . rex_url::addonAssets('vidstack', 'vidstack_helper.js') . '"></script>';

| `generate()` | Player-HTML ohne Wrapper |

| `generateFull()` | Voller Player mit Consent || `setLoadStrategy()` | `'eager'`, `'idle'`, `'visible'`, `'play'` | Performance-Optimierung |



### 🔧 Alte API (v1.x) - Funktioniert weiter!| `enableResume()` | `?string $storageKey` | Position automatisch merken |// Weitere Optionen:```



```php| `addChapters()` | `string $vttFile` | Kapitel-Navigation |

// Der alte Weg funktioniert nach wie vor:

$video = new Video('video.mp4', 'Titel');| `addCaptions()` | `string $vtt, string $label, bool $default` | Untertitel vereinfacht |->setAspectRatio('4/3')   // Klassisch

$video->setPoster('thumb.jpg');

$video->addSubtitle('de.vtt', 'captions', 'Deutsch', 'de', true);| `autoplay()` | - | Autoplay mit Mute |

$video->setAttributes(['data-foo' => 'bar']);

echo $video->generateFull();| `loop()` | - | Endlos-Schleife |->setAspectRatio('21/9')  // Ultrawide/KinoWas passiert hier? Wir benutzen `rex_url::addonAssets()`, um die richtigen URLs für unsere Assets zu generieren. Das ist wie ein Zauberstab, der immer auf die korrekten Dateien in deinem REDAXO-Setup zeigt, egal wo sie sich versteckt haben.

```

| `muted()` | `bool $muted = true` | Stumm schalten |

**Wichtig:** Keine Breaking Changes außer dem alten Consent-System (siehe Migration)!

->setAspectRatio('1/1')   // Quadratisch (Instagram)

#### Alte Methoden die noch funktionieren

### 🔧 Basis-Methoden (weiterhin verfügbar)

| Methode | Parameter |

|---------|-----------|```Die `vidstack.css` und `vidstack.js` sind die Hauptdarsteller - sie bringen den Video-Player zum Laufen. Die `*_helper`-Dateien sind wie die fleißigen Backstage-Helfer. Sie kümmern sich um Extras wie Übersetzungen und andere nützliche Funktionen.

| `new Video()` | `$source, $title, $lang` |

| `addSubtitle()` | `$src, $kind, $label, $lang, $default` || Methode | Parameter | Beschreibung |

| `setSources()` | `array $sources` |

| `setResponsiveSources()` | Desktop/Mobile Quellen ||---------|-----------|--------------|

| `setResponsiveSourcesWithPresets()` | Mit Presets |

| `createAutoSources()` | Auto-Detection Pattern || `new Video()` | `string $source, string $title, string $lang` | Konstruktor (auch mit Factory Methods nutzbar) |



---| `setAttributes()` | `array $attributes` | Setzt HTML-Attribute |**Vorteil:** Verhindert Cumulative Layout Shift (CLS), bessere Core Web Vitals!So, jetzt aber! Dein REDAXO ist jetzt bereit, Videos mit Style zu servieren. 🎬🍿



## 🎭 Migration v1.x → v2.0| `setAttribute()` | `string $key, mixed $value` | Setzt einzelnes Attribut |



### Was funktioniert noch?| `setPoster()` | `string $src, string $alt` | Setzt Vorschaubild |



**Alles!** Dein alter Code läuft unverändert:| `setThumbnails()` | `string $url` | Setzt Thumbnail-Sprites |



```php| `addSubtitle()` | `string $src, string $kind, string $label, string $lang, bool $default` | Fügt Untertitel/Chapters hinzu |### 2️⃣ Loading Strategy - Performance-Optimierung### Source Sizes für Desktop/Mobile Videos

// v1.x Code - läuft problemlos!

$video = new Video('video.mp4', 'Mein Video');| `setSources()` | `array $sources` | Mehrere Video-Quellen (Multi-Resolution) |

$video->setPoster('thumb.jpg');

$video->addSubtitle('de.vtt', 'captions', 'Deutsch', 'de', true);| `setResponsiveSources()` | `string $desktopSrc, string $mobileSrc, ?array $desktopSize, ?array $mobileSize` | Desktop/Mobile Video-Varianten |

echo $video->generateFull();

```| `setResponsiveSourcesWithPresets()` | `string $desktopSrc, string $mobileSrc, string $desktopPreset, string $mobilePreset` | Mit Presets (2k, 1080p, 720p, etc.) |



### Was ist neu?| `createAutoSources()` | `string $baseFilename` | Automatische Quellen aus Dateiname-Pattern |```phpMit dem Vidstack-Addon können Sie verschiedene Video-Auflösungen für Desktop und Mobile bereitstellen:



**Schönere Syntax, gleiche Funktion:**| `setA11yContent()` | `string $content` | Barrierefreie Zusatzinformationen |



```php| `generate()` | - | Generiert Player-HTML |$video = Video::local('video.mp4')

// v2.0 Code - mit Fluent Interface

$video = Video::local('video.mp4', 'Mein Video')| `generateFull()` | - | Generiert Player mit Wrapper + Consent Manager |

    ->setPoster('thumb.jpg')

    ->addCaptions('de.vtt', 'Deutsch', true);    ->setLoadStrategy('idle');```php

echo $video->generateFull();

```---



### Breaking Changes?<?php



⚠️ **Nur wenn du das alte Consent-System genutzt hast:**## 💡 Praktische Beispiele



- `generateConsentPlaceholder()` entfernt// Strategien:use FriendsOfRedaxo\VidStack\Video;

- Consent JavaScript entfernt  

- **Lösung:** [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager) installieren### YouTube mit Autoplay



**Für 99% der Nutzer: Keine Änderungen nötig!**->setLoadStrategy('eager')    // Sofort laden



---```php



## 💡 Tipps & Tricks$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')->setLoadStrategy('idle')     // Laden wenn Browser idle// Einfache Desktop/Mobile Setup mit Standard-Auflösungen



### URL-Autoerkennung    ->autoplay()



Vidstack erkennt YouTube/Vimeo automatisch:    ->loop();->setLoadStrategy('visible')  // Laden wenn sichtbar (Standard)$video = new Video('video-desktop.mp4', 'Responsives Video');



```phpecho $video->generateFull();

// Alle Varianten funktionieren:

new Video('https://www.youtube.com/watch?v=xyz', 'Titel');```->setLoadStrategy('play')     // Erst beim Abspielen laden$video->setResponsiveSources('video-1080p.mp4', 'video-480p.mp4');

new Video('https://youtu.be/xyz', 'Titel');

Video::youtube('https://www.youtube.com/watch?v=xyz', 'Titel');

```

**DSGVO:** Consent Manager blockiert automatisch YouTube, bis User zustimmt!```echo $video->generateFull();

### Helper-Funktion für Standard-Videos



```php

function standardVideo($source, $title = '') {### Lokales Video mit allem Drum und Dran

    return Video::local($source, $title)

        ->setPoster('default-poster.jpg')

        ->setAspectRatio('16/9')

        ->setLoadStrategy('visible');```php**Vorteil:** Optimiert Page Load, reduziert initiale Bandwidth!// Mit benutzerdefinierten Auflösungen

}

$video = Video::local('produkt.mp4', 'Produktvideo')

// Nutzen:

echo standardVideo('video.mp4', 'Mein Video')->generateFull();    ->setPoster('preview.jpg', 'Produktvorschau')$video = new Video('video-desktop.mp4', 'Custom Responsive Video');

```

    ->setAspectRatio('16/9')

### REX_MEDIA Integration

    ->setLoadStrategy('visible')### 3️⃣ Resume Support - Position merken$video->setResponsiveSources(

```php

$mediaFile = 'REX_MEDIA[1]';    ->addCaptions('de.vtt', 'Deutsch', true)



if ($mediaFile) {    ->addCaptions('en.vtt', 'English')    'video-high.mp4', 

    $video = Video::local($mediaFile, 'Video aus Medienpool');

        ->addChapters('chapters.vtt');

    // Poster auch aus REDAXO?

    if ('REX_MEDIA[2]') {echo $video->generateFull();```php    'video-low.mp4',

        $video->setPoster(rex_url::media('REX_MEDIA[2]'));

    }```

    

    echo $video->generateFull();// Automatischer Storage-Key    [2560, 1440], // Desktop: 2K

}

```### Tutorial mit Resume-Funktion



### FFmpeg-Integration$video = Video::tutorial('tutorial.mp4')    [960, 540]    // Mobile: Mobile HD



Wenn [FFmpeg AddOn](https://github.com/FriendsOfREDAXO/ffmpeg) installiert ist:```php



- ✅ Zeigt Video-Infos im Medienpool (Auflösung, Codec, Bitrate)$video = Video::tutorial('redaxo-tutorial.mp4', 'REDAXO Grundlagen')    ->enableResume(););

- ✅ Action-Buttons (Trimmen, Optimieren)

- ✅ Automatische Metadaten    ->setPoster('thumbnail.jpg')



### OEmbed für CKE5    ->addChapters('chapters.vtt')echo $video->generateFull();



CKE5 kann Videos einbinden, aber nicht im Frontend ausgeben. Die Lösung:    ->setAspectRatio('16/9')



```php    ->setLoadStrategy('idle');// Custom Storage-Key (für mehrere Videos)

// In boot.php vom Project-AddOn:

if (rex::isFrontend()) {echo $video->generateFull();

    Video::videoOembedHelper();

}```$video = Video::local('lesson-01.mp4')// Mit Auflösungspresets

```



Oder manuell parsen:

**Automatisch:** Position wird gespeichert, User kann fortsetzen!    ->enableResume('kurs-lesson-01');$video = new Video('video.mp4', 'Preset Video');

```php

$content = 'Hier ist ein <oembed url="https://youtube.com/..."></oembed>';

echo Video::parseOembedTags($content);

```### Barrierefreies Video```$video->setResponsiveSourcesWithPresets('video-2k.mp4', 'video-mobile.mp4', '2k', 'mobile_hd');



### CSS-Anpassungen



```css```phpecho $video->generateFull();

/* Vidstack Container */

.vidstack-wrapper {$video = Video::local('video.mp4', 'Barrierefreies Video')

    /* Deine Styles */

}    ->setPoster('preview.jpg')**Vorteil:** User kann Video fortsetzen wo aufgehört - perfekt für Tutorials!



/* Player */    ->addCaptions('de.vtt', 'Deutsch', true)

media-player {

    --media-brand: #ff0000;    ->setA11yContent('// Automatische Erstellung aus Dateinamen-Pattern

}

        <h3>Videoinhalt</h3>

/* Controls */

.vds-controls {        <p>Dieses Video zeigt...</p>### 4️⃣ Chapters - Kapitel-Navigation$video = new Video('produktvideo.mp4', 'Produktvideo');

    /* Custom Controls */

}        <ul>

```

            <li>Punkt 1</li>if ($video->createAutoSources('produktvideo')) {

### Performance: Lazy Loading

            <li>Punkt 2</li>

```php

$videos = [];        </ul>```php    // Sucht automatisch nach: produktvideo-1080p.mp4, produktvideo-720p.mp4, produktvideo-480p.mp4



// Mehrere Videos vorbereiten    ');

$videos[] = Video::local('video1.mp4')->setLoadStrategy('visible');

$videos[] = Video::local('video2.mp4')->setLoadStrategy('visible');echo $video->generateFull();$video = Video::local('long-video.mp4')    echo $video->generateFull();

$videos[] = Video::local('video3.mp4')->setLoadStrategy('visible');

```

// Nur sichtbare Videos werden geladen!

foreach ($videos as $video) {    ->addChapters('chapters.vtt');}

    echo $video->generateFull();

}### Audio-Player

```

```

---

```php

## 🎪 Backend-Integration

$video = Video::local('podcast.mp3', 'Mein Podcast')// Mehrere Qualitätsstufen mit manueller Kontrolle

### Medienpool-Vorschau

    ->setAttribute('audio', true);

Videos im Medienpool werden automatisch mit Player angezeigt. Keine Konfiguration nötig!

echo $video->generateFull();**chapters.vtt Beispiel:**$video = new Video('video.mp4', 'Multi-Quality Video');

![Medienpool Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/mediapool.png?raw=true)

```

### FFmpeg-Infos

```vtt$video->setSources([

Mit FFmpeg AddOn siehst du:

- **Auflösung**: 1920×1080 px (16:9)---

- **Codec**: H264, VP9, AV1

- **Dauer**: 05:42WEBVTT    ['src' => 'video-4k.mp4', 'width' => 3840, 'height' => 2160, 'type' => 'video/mp4'],

- **Dateigröße**: 45.2 MB

- **Bitrate**: 2.4 Mbps## 🎬 Responsive Videos (Multi-Resolution)



---    ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],



## 🌍 Mehrsprachigkeit### Desktop/Mobile mit Presets



Vidstack spricht mehr Sprachen als ein Eurovision-Moderator:00:00:00.000 --> 00:01:30.000    ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],



- 🇩🇪 Deutsch (de)```php

- 🇬🇧 Englisch (en)

- 🇪🇸 Spanisch (es)$video = Video::local('video.mp4', 'Responsives Video')Einleitung    ['src' => 'video-480p.mp4', 'width' => 854, 'height' => 480, 'type' => 'video/mp4']

- 🇫🇷 Französisch (fr)

- 🇸🇮 Slowenisch (si)    ->setResponsiveSourcesWithPresets(



```php        'video-1080p.mp4',  // Desktop]);

$video = new Video('video.mp4', 'Mi Video', 'es');

```        'video-480p.mp4',   // Mobile



---        '1080p',            // Desktop Preset00:01:30.000 --> 00:05:00.000echo $video->generateFull();



## 🆘 Support        'mobile_sd'         // Mobile Preset



- **GitHub Issues:** [github.com/FriendsOfREDAXO/vidstack/issues](https://github.com/FriendsOfREDAXO/vidstack/issues)    )Hauptteil```

- **REDAXO Forum:** [redaxo.org/forum](https://www.redaxo.org/forum/)

- **Slack:** [FriendsOfREDAXO Slack](https://friendsofredaxo.slack.com/)    ->setPoster('preview.jpg');



---echo $video->generateFull();



## 📖 Weitere Docs```



- **[PHASE1_FEATURES.md](PHASE1_FEATURES.md)** - Alle v2.0 Features im Detail00:05:00.000 --> 00:07:00.000**Verfügbare Auflösungspresets:**

- **[CONSENT_MANAGER_INTEGRATION.md](CONSENT_MANAGER_INTEGRATION.md)** - DSGVO deep dive

- **[INTEGRATION_FLOW.md](INTEGRATION_FLOW.md)** - Architektur-Diagramme**Verfügbare Presets:**



---- `4k`: 3840×2160Zusammenfassung- `4k` (3840×2160), `2k` (2560×1440), `1080p` (1920×1080)



## 👨‍💻 Für Entwickler- `2k`: 2560×1440



### Vendor-Update- `1080p`: 1920×1080```- `720p` (1280×720), `480p` (854×480), `360p` (640×360)



```bash- `720p`: 1280×720

cd build/

npm install- `480p`: 854×480- `mobile_hd` (960×540), `mobile_sd` (640×360), `tablet` (1024×576)

npm run build

# Kopiere aus dist/ nach assets/- `mobile_hd`: 960×540

```

- `mobile_sd`: 640×360### 5️⃣ Convenience Methods

### Contribution



Pull Requests sind willkommen! Bitte:

- Code testen### Automatische Quellen aus Dateiname-Pattern**Wie es funktioniert:** Der Browser wählt automatisch die beste verfügbare Quelle basierend auf Gerätegröße und Netzwerkbedingungen. Die Quellen werden nach Qualität sortiert ausgegeben (höchste zuerst). Das Sorting wird gecacht für bessere Performance.

- Dokumentation updaten

- Commit Messages sinnvoll schreiben



---```php```php



## 🎬 Credits$video = Video::local('video.mp4', 'Auto-Quality Video');



**Roll the Credits:**if ($video->createAutoSources('video')) {$video = Video::youtube('https://youtube.com/watch?v=xyz')### 🔄 Vorher vs. Nachher - Wie viel einfacher es geworden ist



- **Vidstack.io** - Der Player: [vidstack.io](https://www.vidstack.io)    // Sucht automatisch nach:

- **REDAXO CMS** - Das System: [redaxo.org](https://www.redaxo.org)

- **FriendsOfREDAXO** - Die Community: [github.com/FriendsOfREDAXO](https://github.com/FriendsOfREDAXO)    // - video-1080p.mp4    ->autoplay()     // Autoplay mit Mute (Browser-konform)

- **Thomas Skerbis** - Projektleitung: [github.com/skerbis](https://github.com/skerbis)

- **Ein bisschen KI** 🤖    // - video-720p.mp4



---    // - video-480p.mp4    ->loop()         // Endlos-Schleife#### Altes API (vor Phase 1)



## 📄 Lizenz    echo $video->generateFull();



MIT License - Mach was draus!}    ->muted();       // Stumm schalten```php



---```



**Und Action! 🎬🍿**$video = new Video('tutorial.mp4', 'Mein Tutorial');



Jetzt hast du alles, was du brauchst, um Videos wie ein Profi einzubinden. Bei Fragen: Einfach ein Issue öffnen oder im Forum melden.### Manuelle Multi-Resolution



Viel Erfolg mit deinen Videos! 🚀// Untertitel vereinfacht$video->setPoster('thumb.jpg');


```php

$video = Video::local('video.mp4', 'Multi-Quality Video')$video->addCaptions('subtitles.vtt');                    // Einfach$video->setAttributes(['data-aspect-ratio' => '16/9']);

    ->setSources([

        ['src' => 'video-4k.mp4', 'width' => 3840, 'height' => 2160, 'type' => 'video/mp4'],$video->addCaptions('de.vtt', 'Deutsch', true);         // Mit Label + Default$video->addSubtitle('chapters.vtt', 'Chapters', 'en', 'chapters', false);

        ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],

        ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],```$video->addSubtitle('subtitles.vtt', 'Deutsch', 'de', 'captions', true);

    ]);

echo $video->generateFull();$video->setAttributes(array_merge($video->getAttributes() ?? [], [

```

---    'autoplay' => 'true',

---

    'muted' => 'true',

## 🔒 DSGVO & Consent Manager

## 📚 Alle Methoden    'loop' => 'true'

### Automatische Integration

]));

Ab Version 2.0.0 integriert Vidstack automatisch mit dem [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager):

### ✨ Factory Methods (NEU)echo $video->generateFull();

```php

// YouTube wird automatisch blockiert bis zur Einwilligung```

$video = Video::youtube('https://youtube.com/watch?v=xyz', 'Mein Video')

    ->setPoster('preview.jpg');  // Poster wird als Platzhalter genutzt| Methode | Beschreibung |

echo $video->generateFull();

```|---------|--------------|#### Neues API (Phase 1)



**Was passiert:**| `Video::youtube($url, $title)` | YouTube mit Consent Manager Integration |```php

1. ✅ Video wird automatisch erkannt (YouTube/Vimeo)

2. ✅ Consent Manager blockiert Einbettung| `Video::vimeo($url, $title)` | Vimeo mit Consent Manager Integration |$video = Video::tutorial('tutorial.mp4', 'Mein Tutorial')

3. ✅ Poster-Bild wird als Thumbnail genutzt

4. ✅ Nach Einwilligung: Video lädt automatisch| `Video::local($filename, $title)` | Lokales Video mit Smart Defaults |    ->setPoster('thumb.jpg')



### Erforderliche Consent Manager Services| `Video::tutorial($source, $title)` | Mit automatischer Resume-Funktion |    ->setAspectRatio('16/9')



Im Consent Manager müssen folgende Service-UIDs angelegt sein:    ->addChapters('chapters.vtt')

- `youtube` für YouTube-Videos

- `vimeo` für Vimeo-Videos### ⚡ Phase 1 Features (NEU)    ->addCaptions('subtitles.vtt', 'Deutsch', true)



### Ohne Consent Manager    ->autoplay()



Wenn Consent Manager nicht installiert ist, werden Videos direkt geladen (Graceful Degradation).| Methode | Parameter | Beschreibung |    ->loop();



---|---------|-----------|--------------|echo $video->generateFull();



## 🔄 URL-Autoerkennung| `setAspectRatio()` | `'16/9'`, `'4/3'`, `'21/9'`, `'1/1'` | Verhindert Layout Shift |```



Das AddOn erkennt automatisch YouTube- und Vimeo-URLs:| `setLoadStrategy()` | `'eager'`, `'idle'`, `'visible'`, `'play'` | Performance-Optimierung |



```php| `enableResume()` | `?string $storageKey` | Position automatisch merken |**Unterschied:** 

// Alle diese Varianten funktionieren:

| `addChapters()` | `string $vttFile` | Kapitel-Navigation |- ✅ **8 Zeilen → 8 verkettete Aufrufe** (aber viel lesbarer!)

// YouTube

new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Titel');| `addCaptions()` | `string $vtt, string $label, bool $default` | Untertitel vereinfacht |- ✅ **Keine manuelle Array-Manipulation** mehr nötig

new Video('https://youtu.be/dQw4w9WgXcQ', 'Titel');

Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Titel');| `autoplay()` | - | Autoplay mit Mute |- ✅ **Selbsterklärende Methoden** wie `autoplay()` statt kryptischem Array



// Vimeo| `loop()` | - | Endlos-Schleife |- ✅ **Factory-Methoden** mit Smart Defaults (`Video::tutorial()`)

new Video('https://vimeo.com/148751763', 'Titel');

new Video('https://player.vimeo.com/video/148751763', 'Titel');| `muted()` | `bool $muted = true` | Stumm schalten |- ✅ **Spezielle Methoden** wie `addChapters()` statt generischem `addSubtitle()`

Video::vimeo('https://vimeo.com/148751763', 'Titel');



// Lokale Dateien

new Video('video.mp4', 'Titel');### 🔧 Basis-Methoden (weiterhin verfügbar)### Grundlegende Verwendung

new Video('media://video.mp4', 'Titel');

Video::local('video.mp4', 'Titel');

```

| Methode | Parameter | Beschreibung |```php

**Tipp:** Factory Methods sind der empfohlene Weg, da sie optimale Defaults setzen!

|---------|-----------|--------------|<?php

---

| `new Video()` | `string $source, string $title, string $lang` | Konstruktor (auch mit Factory Methods nutzbar) |use FriendsOfRedaxo\VidStack\Video;

## 🆙 Migration von v1.x zu v2.0

| `setAttributes()` | `array $attributes` | Setzt HTML-Attribute |

### Was funktioniert weiterhin?

| `setAttribute()` | `string $key, mixed $value` | Setzt einzelnes Attribut |// Einfachste Variante - YouTube

**Alle alten Methoden funktionieren unverändert:**

| `setPoster()` | `string $src, string $alt` | Setzt Vorschaubild |$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Never Gonna Give You Up');

```php

// v1.x Code funktioniert weiterhin!| `setThumbnails()` | `string $url` | Setzt Thumbnail-Sprites |echo $video->generateFull();

$video = new Video('video.mp4', 'Titel');

$video->setPoster('thumb.jpg');| `addSubtitle()` | `string $src, string $kind, string $label, string $lang, bool $default` | Fügt Untertitel/Chapters hinzu |

$video->addSubtitle('de.vtt', 'captions', 'Deutsch', 'de', true);

$video->setAttributes(['data-aspect' => '16/9']);| `setSources()` | `array $sources` | Mehrere Video-Quellen (Multi-Resolution) |// Vimeo mit Poster

echo $video->generateFull();

```| `setResponsiveSources()` | `string $desktopSrc, string $mobileSrc, ?array $desktopSize, ?array $mobileSize` | Desktop/Mobile Video-Varianten |$video = Video::vimeo('https://vimeo.com/148751763', 'Vimeo-Beispiel')



### Was ist neu?| `setResponsiveSourcesWithPresets()` | `string $desktopSrc, string $mobileSrc, string $desktopPreset, string $mobilePreset` | Mit Presets (2k, 1080p, 720p, etc.) |    ->setPoster('vorschau.jpg');



**Neue API ist optional, aber empfohlen:**| `createAutoSources()` | `string $baseFilename` | Automatische Quellen aus Dateiname-Pattern |echo $video->generateFull();



```php| `setA11yContent()` | `string $content` | Barrierefreie Zusatzinformationen |

// v2.0+ mit neuer API (gleiche Funktionalität, bessere Lesbarkeit)

$video = Video::local('video.mp4', 'Titel')| `generate()` | - | Generiert Player-HTML |// Lokales Video mit Smart Defaults

    ->setPoster('thumb.jpg')

    ->addCaptions('de.vtt', 'Deutsch', true)| `generateFull()` | - | Generiert Player mit Wrapper + Consent Manager |$video = Video::local('video.mp4', 'Eigenes Video')

    ->setAspectRatio('16/9');

echo $video->generateFull();    ->setPoster('thumb.jpg');

```

---echo $video->generateFull();

### Breaking Changes



⚠️ **Nur wenn du das alte Consent-System genutzt hast:**

## 💡 Praktische Beispiele// Tutorial-Video (merkt sich Position)

- `generateConsentPlaceholder()` wurde entfernt

- Consent-Helper JavaScript wurde entfernt$video = Video::tutorial('tutorial.mp4', 'REDAXO Tutorial')

- Migration: Nutze [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager)

### YouTube mit Autoplay    ->setPoster('thumb.jpg')

**Für normale Video-Einbindungen: Keine Änderungen nötig!**

    ->addChapters('kapitel.vtt');

---

```phpecho $video->generateFull();

## 📖 Weitere Dokumentation

$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Astley')```

- **[CONSENT_MANAGER_INTEGRATION.md](CONSENT_MANAGER_INTEGRATION.md)** - Detaillierte DSGVO-Integration

- **[INTEGRATION_FLOW.md](INTEGRATION_FLOW.md)** - Technische Architektur-Diagramme    ->autoplay()

- **[PHASE1_FEATURES.md](PHASE1_FEATURES.md)** - Alle Phase 1 Features im Detail

    ->loop();**Neu:** Fluent Interface (Method Chaining) macht den Code lesbarer!

---

echo $video->generateFull();

## 💬 Support & Community

```### Grundlegende Beispiele für den Alltag

- **Issues:** [GitHub Issues](https://github.com/FriendsOfREDAXO/vidstack/issues)

- **Forum:** [REDAXO Forum](https://www.redaxo.org/forum/)

- **Slack:** [FriendsOfREDAXO Slack](https://friendsofredaxo.slack.com/)

**DSGVO:** Consent Manager blockiert automatisch YouTube, bis User zustimmt!#### Video mit Poster-Bild und Titel

---



## 🙏 Credits

### Lokales Video mit allem Drum und Dran```php

- **Vidstack.io:** [vidstack.io](https://www.vidstack.io)

- **REDAXO:** [redaxo.org](https://www.redaxo.org)<?php

- **FriendsOfREDAXO:** [github.com/FriendsOfREDAXO](https://github.com/FriendsOfREDAXO)

```phpuse FriendsOfRedaxo\VidStack\Video;

---

$video = Video::local('produkt.mp4', 'Produktvideo')

## 📄 Lizenz

    ->setPoster('preview.jpg', 'Produktvorschau')// Einfach mit Fluent Interface

MIT License - siehe [LICENSE](LICENSE) Datei.

    ->setAspectRatio('16/9')$video = Video::local('mein_video.mp4', 'Mein tolles Video')

    ->setLoadStrategy('visible')    ->setPoster('vorschaubild.jpg', 'Beschreibung des Vorschaubilds')

    ->addCaptions('de.vtt', 'Deutsch', true)    ->setAspectRatio('16/9');

    ->addCaptions('en.vtt', 'English')echo $video->generateFull();

    ->addChapters('chapters.vtt');```

echo $video->generateFull();

```#### Video mit Untertiteln (VTT-Format)



### Tutorial mit Resume-Funktion```php

<?php

```phpuse FriendsOfRedaxo\VidStack\Video;

$video = Video::tutorial('redaxo-tutorial.mp4', 'REDAXO Grundlagen')

    ->setPoster('thumbnail.jpg')// Vereinfacht mit addCaptions()

    ->addChapters('chapters.vtt')$video = Video::local('erklaervideo.mp4', 'Erklärvideo')

    ->setAspectRatio('16/9')    ->addCaptions('untertitel_de.vtt', 'Deutsch', true)

    ->setLoadStrategy('idle');    ->addCaptions('untertitel_en.vtt', 'Englisch');

echo $video->generateFull();echo $video->generateFull();

``````



**Automatisch:** Position wird gespeichert, User kann fortsetzen!#### Barrierefreies Video mit Beschreibungen



### Barrierefreies Video```php

<?php

```phpuse FriendsOfRedaxo\VidStack\Video;

$video = Video::local('video.mp4', 'Barrierefreies Video')

    ->setPoster('preview.jpg')// Alles in einer fluent chain

    ->addCaptions('de.vtt', 'Deutsch', true)$video = Video::tutorial('tutorial.mp4', 'Tutorial: REDAXO Installation')

    ->setA11yContent('    ->setPoster('thumb.jpg')

        <h3>Videoinhalt</h3>    ->addChapters('chapters.vtt')

        <p>Dieses Video zeigt...</p>    ->addCaptions('untertitel.vtt', 'Deutsch', true)

        <ul>    ->setA11yContent(

            <li>Punkt 1</li>        'Das Video zeigt Schritt für Schritt, wie REDAXO installiert wird.',

            <li>Punkt 2</li>        'https://beispiel.de/redaxo-installation-text.html'

        </ul>    );

    ');

echo $video->generateFull();echo $video->generateFull();

``````



### Audio-Player#### YouTube-Video einbinden



```php```php

$video = Video::local('podcast.mp3', 'Mein Podcast')<?php

    ->setAttribute('audio', true);use FriendsOfRedaxo\VidStack\Video;

echo $video->generateFull();

```// Einfachste Variante

echo Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video')->generateFull();

---

// Mit Optionen

## 🎬 Responsive Videos (Multi-Resolution)$video = Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'YouTube-Video')

    ->autoplay(true)  // Autoplay mit Mute

### Desktop/Mobile mit Presets    ->loop();         // Endlos-Schleife



```phpecho $video->generateFull();

$video = Video::local('video.mp4', 'Responsives Video')```

    ->setResponsiveSourcesWithPresets(

        'video-1080p.mp4',  // Desktop**Datenschutzhinweis:** Für DSGVO-konforme Einbindung von YouTube/Vimeo empfehlen wir die Nutzung des [Consent Manager AddOns](https://github.com/FriendsOfREDAXO/consent_manager), das eine Zwei-Klick-Lösung mit Inline-Consent bietet.

        'video-480p.mp4',   // Mobile

        '1080p',            // Desktop Preset#### Video mit Vorschaubildern für die Zeitleiste (VTT-Format)

        'mobile_sd'         // Mobile Preset

    )```php

    ->setPoster('preview.jpg');<?php

echo $video->generateFull();use FriendsOfRedaxo\VidStack\Video;

```

// Video mit Thumbnail-Vorschau beim Hover über die Zeitleiste

**Verfügbare Presets:**$video = new Video('produktvideo.mp4', 'Produktvideo mit Thumbnail-Vorschau');

- `4k`: 3840×2160

- `2k`: 2560×1440// VTT-Datei mit Zeitstempeln und Bildpfaden

- `1080p`: 1920×1080$video->setThumbnails('thumbnails.vtt'); 

- `720p`: 1280×720

- `480p`: 854×480// Beispiel für eine thumbnails.vtt Datei:

- `mobile_hd`: 960×540// WEBVTT

- `mobile_sd`: 640×360//

// 00:00:00.000 --> 00:00:05.000

### Automatische Quellen aus Dateiname-Pattern// thumbnails/img1.jpg

// 

```php// 00:00:05.000 --> 00:00:10.000

$video = Video::local('video.mp4', 'Auto-Quality Video');// thumbnails/img2.jpg

if ($video->createAutoSources('video')) {

    // Sucht automatisch nach:echo $video->generate();

    // - video-1080p.mp4```

    // - video-720p.mp4

    // - video-480p.mp4#### Audio-Player

    echo $video->generateFull();

}```php

```<?php

use FriendsOfRedaxo\VidStack\Video;

### Manuelle Multi-Resolution

// Audio-Datei einbinden

```php$audio = new Video('podcast.mp3', 'Podcast Episode #42');

$video = Video::local('video.mp4', 'Multi-Quality Video')

    ->setSources([// Audioplayer bekommt automatisch das richtige Layout

        ['src' => 'video-4k.mp4', 'width' => 3840, 'height' => 2160, 'type' => 'video/mp4'],echo $audio->generate();

        ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],```

        ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4'],

    ]);## � FFmpeg-Integration (Backend-Funktionalität)

echo $video->generateFull();

```Wenn das [FFmpeg-AddOn](https://github.com/FriendsOfREDAXO/ffmpeg) installiert und aktiv ist, zeigt Vidstack automatisch detaillierte Video-Informationen im Medienpool an.



---### Was wird angezeigt?



## 🔒 DSGVO & Consent ManagerIm Medienpool wird unter jedem Video automatisch eine kompakte Informationsbox eingeblendet mit:



### Automatische Integration- **Auflösung**: Breite × Höhe in Pixeln (z.B. 1920 × 1080 px) und Seitenverhältnis (z.B. 16:9)

- **Video-Codec**: Komprimierungsformat (z.B. H264, VP9, AV1)

Ab Version 2.0.0 integriert Vidstack automatisch mit dem [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager):- **Dauer**: Formatierte Videolänge (z.B. 05:42 oder 01:23:45)

- **Dateigröße**: Größe der Videodatei (z.B. 45.2 MB)

```php- **Bitrate**: Datenrate des Videos (z.B. 2.4 Mbps) - nur bei aussagekräftigen Werten

// YouTube wird automatisch blockiert bis zur Einwilligung

$video = Video::youtube('https://youtube.com/watch?v=xyz', 'Mein Video')### Voraussetzungen

    ->setPoster('preview.jpg');  // Poster wird als Platzhalter genutzt

echo $video->generateFull();```bash

```# FFmpeg muss auf dem Server installiert sein

ffmpeg -version

**Was passiert:**

1. ✅ Video wird automatisch erkannt (YouTube/Vimeo)# FFmpeg-AddOn in REDAXO installieren und aktivieren

2. ✅ Consent Manager blockiert Einbettung```

3. ✅ Poster-Bild wird als Thumbnail genutzt

4. ✅ Nach Einwilligung: Video lädt automatisch### Funktionsweise



### Erforderliche Consent Manager ServicesDie Integration erfolgt vollautomatisch:



Im Consent Manager müssen folgende Service-UIDs angelegt sein:1. **Automatische Erkennung**: Vidstack prüft beim Laden einer Video-Datei im Medienpool, ob das FFmpeg-AddOn verfügbar ist

- `youtube` für YouTube-Videos2. **Video-Analyse**: Falls verfügbar, werden die Video-Metadaten über die FFmpeg VideoInfo-Klasse ausgelesen

- `vimeo` für Vimeo-Videos3. **Anzeige**: Die Informationen werden kompakt unter dem Video-Player dargestellt

4. **Action-Buttons**: Direkte Verlinkung zu FFmpeg-Tools für weitere Bearbeitung

### Ohne Consent Manager

### Action-Buttons

Wenn Consent Manager nicht installiert ist, werden Videos direkt geladen (Graceful Degradation).

Unter den Video-Informationen werden praktische Buttons angezeigt:

---

- **🔧 Trimmen**: Öffnet den FFmpeg-Trimmer zum Schneiden des Videos

## 🎨 Styling & Layout- **📦 Optimieren**: Startet die Komprimierung für Web-optimierte Versionen  

- **ℹ️ Details**: Zeigt ausführliche technische Video-Informationen

### CSS-Klassen

Die Buttons führen direkt zu den entsprechenden FFmpeg-Tools und übertragen automatisch den Dateinamen.

```css

/* Vidstack Container */### Ohne FFmpeg-AddOn

.vidstack-wrapper { }

Ohne das FFmpeg-AddOn funktioniert Vidstack weiterhin normal, zeigt aber keine technischen Video-Informationen an.

/* Media Player Element */

media-player { }## 🎯 Neue vereinfachte API (Phase 1)



/* Controls */### Factory-Methoden (einfacher Einstieg)

.vds-controls { }

```php

/* Poster */// YouTube

.vds-poster { }Video::youtube($url, $title)



/* A11y Content */// Vimeo

.a11y-content { }Video::vimeo($url, $title)

```

// Lokales Video (mit Smart Defaults)

### Custom AttributesVideo::local($filename, $title)



```php// Tutorial-Video (mit Resume-Funktion)

$video = Video::local('video.mp4')Video::tutorial($source, $title)

    ->setAttribute('crossorigin', 'anonymous')```

    ->setAttribute('playsinline', true)

    ->setAttributes([### Neue Features

        'data-custom' => 'wert',

        'preload' => 'auto'#### Aspect Ratio (verhindert Layout-Shift)

    ]);```php

```$video->setAspectRatio('16/9');  // oder '4/3', '21/9', '1/1'

```

---

#### Loading Strategy (Performance)

## 🔄 URL-Autoerkennung```php

$video->setLoadStrategy('idle');  // 'eager', 'idle', 'visible', 'play'

Das AddOn erkennt automatisch YouTube- und Vimeo-URLs:```



```php#### Resume/Position merken

// Alle diese Varianten funktionieren:```php

$video->enableResume();  // Auto Storage-Key

// YouTube$video->enableResume('mein-tutorial');  // Custom Key

new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Titel');```

new Video('https://youtu.be/dQw4w9WgXcQ', 'Titel');

Video::youtube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Titel');#### Chapters (Kapitel-Navigation)

```php

// Vimeo$video->addChapters('kapitel.vtt');

new Video('https://vimeo.com/148751763', 'Titel');```

new Video('https://player.vimeo.com/video/148751763', 'Titel');

Video::vimeo('https://vimeo.com/148751763', 'Titel');#### Vereinfachte Methoden

```php

// Lokale Dateien$video->autoplay();        // Autoplay mit Mute

new Video('video.mp4', 'Titel');$video->loop();            // Endlos-Schleife

new Video('media://video.mp4', 'Titel');$video->muted();           // Stumm schalten

Video::local('video.mp4', 'Titel');$video->addCaptions($vtt); // Untertitel ohne komplizierte Parameter

``````



**Tipp:** Factory Methods sind der empfohlene Weg, da sie optimale Defaults setzen!### Fluent Interface (Method Chaining)



---Alle Methoden geben `$this` zurück → Chaining möglich!



## 🆙 Migration von v1.x zu v2.0```php

$video = Video::tutorial('video.mp4', 'Mein Tutorial')

### Was funktioniert weiterhin?    ->setPoster('thumb.jpg')

    ->setAspectRatio('16/9')

**Alle alten Methoden funktionieren unverändert:**    ->addChapters('chapters.vtt')

    ->addCaptions('subtitles.vtt')

```php    ->enableResume()

// v1.x Code funktioniert weiterhin!    ->setLoadStrategy('idle');

$video = new Video('video.mp4', 'Titel');

$video->setPoster('thumb.jpg');echo $video->generateFull();

$video->addSubtitle('de.vtt', 'captions', 'Deutsch', 'de', true);```

$video->setAttributes(['data-aspect' => '16/9']);

echo $video->generateFull();## �🛠 Die Class

```

### Konstruktor

### Was ist neu?```php

__construct($source, $title = '', $lang = 'de'): self

**Neue API ist optional, aber empfohlen:**```

- `$source`: URL oder Pfad zum Video (Pflicht)

```php- `$title`: Titel des Videos (Optional)

// v2.0+ mit neuer API (gleiche Funktionalität, bessere Lesbarkeit)- `$lang`: Sprachcode (Optional, Standard: 'de')

$video = Video::local('video.mp4', 'Titel')

    ->setPoster('thumb.jpg')**Tipp:** Nutze die Factory-Methoden `Video::youtube()`, `Video::local()` etc. für einfacheren Code!

    ->addCaptions('de.vtt', 'Deutsch', true)

    ->setAspectRatio('16/9');### Methoden

echo $video->generateFull();- `setAttributes(array $attributes): void`: Zusätzliche Player-Attribute

```- `setA11yContent($description, $alternativeUrl = ''): void`: Barrierefreiheits-Infos

- `setThumbnails($thumbnailsUrl): void`: Thumbnail-Vorschaubilder (VTT-Format)

### Breaking Changes- `setPoster($posterSrc, $posterAlt): void`: Poster-Bild für das Video setzen

- `addSubtitle($src, $kind, $label, $lang, $default = false): void`: Untertitel hinzufügen

⚠️ **Nur wenn du das alte Consent-System genutzt hast:**- `generateFull(): string`: Vollständiger HTML-Code mit allen Schikanen

- `generate(): string`: Einfacher Video-Player ohne Schnickschnack

- `generateConsentPlaceholder()` wurde entfernt- `isMedia($url): bool`: Prüft, ob es sich um eine Mediendatei handelt

- Consent-Helper JavaScript wurde entfernt- `isAudio($url): bool`: Prüft, ob es sich um eine Audiodatei handelt

- Migration: Nutze [Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager)- `videoOembedHelper(): void`: Registriert einen Output-Filter für oEmbed-Tags

- `parseOembedTags(string $content): string`: Parst oEmbed-Tags im Inhalt

**Für normale Video-Einbindungen: Keine Änderungen nötig!**- `show_sidebar(\rex_extension_point $ep): ?string`: Generiert Medienvorschau für die Sidebar im Medienpool

- `getSourceUrl(): string`: Gibt die URL der Videoquelle zurück

---- `getAlternativeUrl(): string`: Gibt eine alternative URL für das Video zurück

- `getVideoInfo($source): array`: Gibt Informationen über das Video zurück (Plattform und ID) [Statische Methode]

## 📖 Weitere Dokumentation- `generateAttributesString(): string`: Generiert einen String mit allen gesetzten Attributen



- **[CONSENT_MANAGER_INTEGRATION.md](CONSENT_MANAGER_INTEGRATION.md)** - Detaillierte DSGVO-Integration## 📋 Optionen und Pflichtangaben

- **[INTEGRATION_FLOW.md](INTEGRATION_FLOW.md)** - Technische Architektur-Diagramme

- **[PHASE1_FEATURES.md](PHASE1_FEATURES.md)** - Alle Phase 1 Features im Detail### Pflichtangaben

- `$source` beim Erstellen des Video-Objekts

---

### Optionale Angaben

## 💬 Support & Community- `$title` beim Erstellen des Video-Objekts

- `$lang` beim Erstellen des Video-Objekts

- **Issues:** [GitHub Issues](https://github.com/FriendsOfREDAXO/vidstack/issues)- Alle Attribute in `setAttributes()`

- **Forum:** [REDAXO Forum](https://www.redaxo.org/forum/)- Beschreibung und alternativer URL in `setA11yContent()`

- **Slack:** [FriendsOfREDAXO Slack](https://friendsofredaxo.slack.com/)- Thumbnail-URL in `setThumbnails()`

- Poster-Bild in `setPoster()`

---- Untertitel-Informationen in `addSubtitle()`



## 🙏 Credits## 🌍 Sprachenwirrwarr



- **Vidstack.io:** [vidstack.io](https://www.vidstack.io)Der Video-Player spricht mehr Sprachen als ein UNO-Dolmetscher! Aktuell im Repertoire:

- **REDAXO:** [redaxo.org](https://www.redaxo.org)- Deutsch (de)

- **FriendsOfREDAXO:** [github.com/FriendsOfREDAXO](https://github.com/FriendsOfREDAXO)- Englisch (en)

- Spanisch (es)

---- Slowenisch (si)

- Französisch (fr)

## 📄 Lizenz

Sprachänderung leicht gemacht:

MIT License - siehe [LICENSE](LICENSE) Datei.

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
$video->setPoster('/pfad/zu/poster.jpg', 'Rick Astley dancing');
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
$video->setPoster('/vimeo_poster.jpg', 'Video thumbnail');
$video->addSubtitle('/sous-titres.vtt', 'captions', 'Français', 'fr', true);
echo $video->generateFull();
```

### 🌟 Full Featured Beispiel - Ein bisschen Hollywood ⭐️

**Aufwendig und zu teuer** 
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

// Setzen des Poster-Bildes
$video->setPoster('/pfad/zu/rickroll_poster.jpg', 'Rick Astley in his iconic pose');

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

Dieses Beispiel zeigt die Hauptfunktionalität des Players mit allen verfügbaren Optionen. In den meisten Fällen wird das bereits alles sein, was Sie brauchen.

## 🛠️ Erweiterte Methoden für spezielle Anwendungsfälle

Die folgenden erweiterten Methoden sind für spezielle Anwendungsfälle gedacht, wenn Sie mehr Kontrolle über den Player benötigen oder eigene Implementierungen erstellen möchten.

### Beispiel 1: Erweiterter Player mit Analytics-Integration

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

function createTrackedVideo($source, $title = '') {
    // Video erstellen
    $video = new Video($source, $title);
    
    // Video-Informationen für Analytics-Tracking
    $videoInfo = Video::getVideoInfo($video->getSourceUrl());
    $platform = $videoInfo['platform'];
    $videoId = $videoInfo['id'];
    
    // Standard HTML für den Player generieren
    $playerHtml = $video->generate();
    
    // Attribute für das Analytics-Tracking hinzufügen
    $trackingAttributes = ' data-tracking="true" data-platform="' . htmlspecialchars($platform) . 
                          '" data-video-id="' . htmlspecialchars($videoId) . '"';
    
    // HTML-Code mit Tracking-Attributen ergänzen
    $trackedHtml = str_replace('<media-player', '<media-player' . $trackingAttributes, $playerHtml);
    
    // JavaScript für das Tracking hinzufügen
    $trackedHtml .= <<<EOT
<script>
document.addEventListener('DOMContentLoaded', function() {
    const player = document.querySelector('media-player[data-tracking="true"]');
    if (player) {
        player.addEventListener('play', function() {
            // Hier Tracking-Code einfügen
            console.log('Video gestartet:', player.getAttribute('data-platform'), player.getAttribute('data-video-id'));
        });
        
        player.addEventListener('ended', function() {
            // Video wurde vollständig angesehen
            console.log('Video beendet:', player.getAttribute('data-platform'), player.getAttribute('data-video-id'));
        });
    }
});
</script>
EOT;
    
    return $trackedHtml;
}

// Verwendung
echo createTrackedVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Tracking-Demo');
```

### Beispiel 2: Eigenes Player-Layout mit zusätzlichen Informationen

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

function createCustomLayoutVideo($source, $title, $showInfo = true) {
    $video = new Video($source, $title);
    
    // Video-Info ermitteln
    $videoInfo = Video::getVideoInfo($source);
    
    // Custom Container erstellen
    $output = '<div class="custom-video-player">';
    
    // Titel und Info anzeigen, wenn gewünscht
    if ($showInfo) {
        $output .= '<div class="video-header">';
        $output .= '<h3>' . htmlspecialchars($title) . '</h3>';
        
        if ($videoInfo['platform'] !== 'default') {
            $platformName = ucfirst($videoInfo['platform']);
            $output .= '<div class="platform-info">Quelle: ' . htmlspecialchars($platformName) . '</div>';
        }
        
        $output .= '</div>';
    }
    
    // Player-Container
    $output .= '<div class="video-container">';
    $output .= $video->generate();
    $output .= '</div>';
    
    // Custom Controls oder zusätzliche Informationen
    if ($showInfo) {
        $output .= '<div class="video-footer">';
        $output .= '<div class="video-source">Video-URL: ' . htmlspecialchars($video->getSourceUrl()) . '</div>';
        $output .= '</div>';
    }
    
    $output .= '</div>';
    
    return $output;
}

// Verwendung
echo createCustomLayoutVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Custom Layout Demo');
```

### Beispiel 3: Adaptive Einbindung basierend auf Gerätetyp

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

function createResponsiveVideo($source, $title = '', $isMobile = false) {
    $video = new Video($source, $title);
    
    // Auf mobilen Geräten andere Attribute setzen
    if ($isMobile) {
        $video->setAttributes([
            'playsinline' => true,
            'preload' => 'none',  // Bandbreite sparen
            'controlsList' => 'nodownload', 
            'disablePictureInPicture' => true,
            'class' => 'mobile-optimized'
        ]);
        
        // Einfache Version für mobile Geräte
        return $video->generate();
    } else {
        // Auf Desktop volle Funktionalität
        $video->setAttributes([
            'class' => 'desktop-enhanced',
            'preload' => 'metadata'
        ]);
        
        // Poster und Untertitel für Desktop hinzufügen
        $video->setPoster('/pfad/zu/hq-poster.jpg', 'Video-Vorschau');
        $video->addSubtitle('/untertitel/deutsch.vtt', 'captions', 'Deutsch', 'de', true);
        
        return $video->generateFull();
    }
}

// Einfache Geräteerkennung (in der Praxis würden Sie hier eine richtige Erkennung verwenden)
$isMobile = strpos($_SERVER['HTTP_USER_AGENT'], 'Mobile') !== false;

// Verwendung
echo createResponsiveVideo('https://example.com/video.mp4', 'Responsives Video', $isMobile);
```

### Beispiel 4: Integration mit REX_MEDIA-Variablen

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// Angenommen, wir haben eine REX_MEDIA-Variable mit einem Video
$mediaName = REX_MEDIA[1];

if ($mediaName) {
    $video = new Video($mediaName, 'Video aus dem Medienpool');
    
    // Prüfen, ob es sich um eine Audiodatei handelt
    if (Video::isAudio($mediaName)) {
        echo '<div class="audio-player-wrapper">';
        echo '<h4>Audio-Player</h4>';
        echo $video->generate();
        echo '</div>';
    } else {
        // Video mit Standardeinstellungen anzeigen
        $video->setAttributes([
            'controls' => true,
            'playsinline' => true
        ]);
        
        // Wenn ein Poster-Bild ausgewählt wurde
        if (REX_MEDIA[2]) {
            $video->setPoster(rex_url::media(REX_MEDIA[2]), 'Vorschaubild');
        }
        
        echo $video->generateFull();
    }
}
```

Durch diese praktischen Beispiele wird deutlich, wie die erweiterten Methoden der Video-Klasse sinnvoll in verschiedenen Szenarien eingesetzt werden können, anstatt sie nur isoliert zu demonstrieren.

## 🧙‍♂️ Tipp: Die magische Default-Funktion

Wer faul clever ist, baut sich eine Hilfsfunktion für Standardeinstellungen:

```php
function createDefaultVideo($source, $title = '', $a11yContent = null) {
    $current_lang = rex_clang::getCurrent();
    $lang_code = $current_lang->getCode();
    $video = new Video($source, $title, $lang_code);
    $video->setAttributes([
        'autoplay' => false,
        'muted' => true,
        'playsinline' => true
    ]);
    if ($a11yContent !== null) {
        $video->setA11yContent($a11yContent);
    }
    $video->setPoster('/pfad/zu/default_poster.jpg', 'Default video poster');
    return $video;
}

// Verwendung
$easyVideo = createDefaultVideo('https://youtube.com/watch?v=abcdefg', 'Einfach Genial', 'Ein Video über etwas Interessantes');
echo $easyVideo->generateFull();
```

## 🎸 Unterstützung für Audio-Dateien

Das Addon unterstützt auch die Einbindung von Audio-Dateien. Genauso wie für Videos:

```php
$audio = new Video('audio.mp3', 'Mein Lieblingssong');
echo $audio->generate();
```

## ✔︎ Im Backend schon integriert

Hier muss man nichts machen - außer Videos schauen. 

![Screenshot](https://github.com/FriendsOfREDAXO/vidstack/blob/assets/mediapool.png?raw=true)


## 🔒 DSGVO & Datenschutz für YouTube/Vimeo

Für die datenschutzkonforme Einbindung von YouTube- und Vimeo-Videos nutzt Vidstack automatisch das **[Consent Manager AddOn](https://github.com/FriendsOfREDAXO/consent_manager)**, falls installiert.

### Automatische Integration

Der Consent Manager bietet:
- ✅ **Inline-Consent**: Platzhalter mit Zwei-Klick-Lösung direkt beim Video
- ✅ **Automatisches Blocking**: Videos werden erst nach Zustimmung geladen
- ✅ **Cookie-Verwaltung**: Zentrale Verwaltung aller Consent-Einstellungen
- ✅ **Mehrsprachig**: Deutsche und englische Texte
- ✅ **Anpassbar**: 5 Theme-Varianten und individuelle Texte

### Voraussetzungen

1. **Consent Manager installieren**:
   ```
   REDAXO Installer → AddOns → consent_manager
   ```

2. **Services konfigurieren**:
   ```
   Consent Manager → Services → YouTube/Vimeo hinzufügen
   ```
   
   Empfohlene Service-UIDs:
   - `youtube` für YouTube-Videos
   - `vimeo` für Vimeo-Videos

### Beispiel-Integration

```php
<?php
use FriendsOfRedaxo\VidStack\Video;

// YouTube-Video einbinden
$video = new Video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mein Video');
$video->setPoster('vorschau.jpg', 'Vorschaubild');

// generateFull() nutzt automatisch den Consent Manager, falls verfügbar
echo $video->generateFull();
```

**Wie es funktioniert:**
- `generateFull()` erkennt automatisch YouTube/Vimeo-URLs
- Falls Consent Manager installiert ist: Inline-Consent-Platzhalter wird gezeigt
- Falls nicht installiert: Video wird direkt geladen (ohne Consent-Abfrage)
- Poster-Bild wird automatisch als Thumbnail für den Platzhalter verwendet

### Ohne Consent Manager

Falls der Consent Manager nicht installiert ist, werden Videos **direkt geladen**. Sie sind dann selbst für die DSGVO-Konformität verantwortlich.




## 📄 CKE5 Oembed - lässig aufgelöst 
(*das Plyr-AddOn lässt grüßen*)

CKE5 kann ja bekanntlich Videos einbinden, aber liefert nichts für die Ausgabe im Frontend mit. 👋 Hier ist die Lösung:

Einfach im String suchen und umwanden: 

```php
echo Video::parseOembedTags($content);
```
und schon sind die Videos da 😀

…oder in der boot.php vom Project-AddOn (gerne auch im eigenen AddOn) den Outputfilter nutzen.


### Outputfilter im Frontend 

```php
if (rex::isFrontend()) {
Video::videoOembedHelper();
}
```

### Outputfilter im Backend: 
Es soll ja nicht nur vorne schön sein. ❤️
Hier muss man dafür sorgen, dass es ggf. in den Blocks nicht ausgeführt wird. 

```php
if (rex::isBackend() && rex_be_controller::getCurrentPagePart(1) == 'content' && !in_array(rex_request::get('function', 'string'), ['add', 'edit'])) {
Video::videoOembedHelper();
}
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
- Im Assets-Ordner die Dateien des Dist-Ordners austauschen (Ihr habt richtig gesehen, es gibt auch die reine JS-Variante 😉) 

PR erstellen 😀

### Alles andere

…fliegt hier so im Repo rum, einfach mal reinschauen. 👀

##  Wie es arbeitet

### Video-Klasse Prozess mit Prüfungen

```mermaid
flowchart TD
    A[Start] --> B[Erstelle Video-Objekt mit Dateipfad]
    B --> C{Ist es eine gültige Datei?}
    C -->|Nein| D[Fehler: Ungültige Datei]
    C -->|Ja| E{Ist es ein unterstütztes Format?}
    E -->|Nein| F[Fehler: Nicht unterstütztes Format]
    E -->|Ja| G[Setze grundlegende Attribute]
    G --> H{Ist es ein Video?}
    H -->|Ja| I[Setze Video-spezifische Attribute]
    H -->|Nein| J[Setze Audio-spezifische Attribute]
    I --> K{Poster-Bild angegeben?}
    K -->|Ja| L{Ist Poster-Datei gültig?}
    L -->|Nein| M[Warnung: Ungültiges Poster]
    L -->|Ja| N[Setze Poster-Bild]
    K -->|Nein| O[Verwende Standard-Poster]
    J --> P[Prüfe auf Untertitel]
    N --> P
    O --> P
    M --> P
    P --> Q{Untertitel vorhanden?}
    Q -->|Ja| R{Sind Untertitel-Dateien gültig?}
    R -->|Nein| S[Warnung: Ungültige Untertitel]
    R -->|Ja| T[Füge Untertitel hinzu]
    Q -->|Nein| U[Keine Untertitel]
    S --> V[Generiere Player-HTML]
    T --> V
    U --> V
    V --> W{HTML erfolgreich generiert?}
    W -->|Nein| X[Fehler: HTML-Generierung fehlgeschlagen]
    W -->|Ja| Y[Zeige Video/Audio-Player]
    Y --> Z[Ende]
    D --> Z
    F --> Z
    X --> Z
```


## Autor(en)

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO
* Ein bisschen KI 😎


**Projektleitung**

[Thomas Skerbis](https://github.com/skerbis)

**Thanks to**
[Vidstack.io](https://www.vidstack.io)
