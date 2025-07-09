<?php
/**
 * BEISPIELE für Aspect Ratio Control mit dem Vidstack-Addon
 * 
 * Diese Datei zeigt, wie man verschiedene Seitenverhältnisse für Videos einstellt,
 * um Portrait-Videos oder andere Formate korrekt darzustellen.
 */

use FriendsOfRedaxo\VidStack\Video;

// ===========================================
// BEISPIEL 1: Portrait-Video (9:16)
// ===========================================

/**
 * Portrait-Video ohne schwarze Ränder
 */
function createPortraitVideo($videoSrc, $title = '') {
    $video = new Video($videoSrc, $title);
    
    // Setze Seitenverhältnis für Portrait-Video
    $video->setAspectRatio('9 / 16');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung:
echo createPortraitVideo('portrait-video.mp4', 'Portrait Video');

// ===========================================
// BEISPIEL 2: Quadratisches Video (1:1)
// ===========================================

/**
 * Quadratisches Video (z.B. für soziale Medien)
 */
function createSquareVideo($videoSrc, $title = '') {
    $video = new Video($videoSrc, $title);
    
    // Setze Seitenverhältnis für quadratisches Video
    $video->setAspectRatio('1 / 1');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung:
echo createSquareVideo('square-video.mp4', 'Quadratisches Video');

// ===========================================
// BEISPIEL 3: Klassisches 4:3 Video
// ===========================================

/**
 * 4:3 Video (altes TV-Format)
 */
function createClassicVideo($videoSrc, $title = '') {
    $video = new Video($videoSrc, $title);
    
    // Setze Seitenverhältnis für 4:3 Video
    $video->setAspectRatio('4 / 3');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung:
echo createClassicVideo('classic-video.mp4', 'Klassisches 4:3 Video');

// ===========================================
// BEISPIEL 4: Ultra-Wide Video (21:9)
// ===========================================

/**
 * Ultra-Wide Video (Kinoformat)
 */
function createUltraWideVideo($videoSrc, $title = '') {
    $video = new Video($videoSrc, $title);
    
    // Setze Seitenverhältnis für Ultra-Wide Video
    $video->setAspectRatio('21 / 9');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung:
echo createUltraWideVideo('ultrawide-video.mp4', 'Ultra-Wide Video');

// ===========================================
// BEISPIEL 5: Automatische Aspect Ratio Erkennung
// ===========================================

/**
 * Automatische Erkennung des Seitenverhältnisses basierend auf Dateieigenschaften
 */
function createAdaptiveVideo($videoSrc, $title = '', $width = null, $height = null) {
    $video = new Video($videoSrc, $title);
    
    // Wenn Breite und Höhe bekannt sind, berechne Seitenverhältnis
    if ($width && $height) {
        $aspectRatio = $width . ' / ' . $height;
        $video->setAspectRatio($aspectRatio);
    }
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung mit bekannten Dimensionen:
echo createAdaptiveVideo('video.mp4', 'Adaptives Video', 1080, 1920); // Portrait
echo createAdaptiveVideo('video.mp4', 'Adaptives Video', 1920, 1080); // Landscape

// ===========================================
// BEISPIEL 6: Responsive Aspect Ratio
// ===========================================

/**
 * Responsive Video mit verschiedenen Seitenverhältnissen für Mobile/Desktop
 */
function createResponsiveAspectRatioVideo($videoSrc, $title = '') {
    $video = new Video($videoSrc, $title);
    
    // Standard: 16:9 (wird durch CSS Media Queries überschrieben)
    $video->setAspectRatio('16 / 9');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata',
        'class' => 'responsive-aspect-video'
    ]);
    
    return $video->generateFull();
}

// Zusätzliche CSS für responsive Aspect Ratio:
?>
<style>
/* Responsive Aspect Ratio - Portrait auf Mobile */
@media (max-width: 768px) and (orientation: portrait) {
    .responsive-aspect-video {
        --aspect-ratio: 9 / 16;
    }
}

/* Landscape auf Desktop */
@media (min-width: 769px) {
    .responsive-aspect-video {
        --aspect-ratio: 16 / 9;
    }
}
</style>
<?php

// Verwendung:
echo createResponsiveAspectRatioVideo('responsive-video.mp4', 'Responsive Aspect Ratio Video');

// ===========================================
// BEISPIEL 7: YouTube/Vimeo mit Custom Aspect Ratio
// ===========================================

/**
 * YouTube/Vimeo Videos mit angepasstem Seitenverhältnis
 */
function createCustomAspectYouTubeVideo($youtubeUrl, $title = '', $aspectRatio = '16 / 9') {
    $video = new Video($youtubeUrl, $title);
    
    // Custom Aspect Ratio setzen
    $video->setAspectRatio($aspectRatio);
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung mit YouTube Shorts (Portrait):
echo createCustomAspectYouTubeVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'YouTube Portrait', '9 / 16');

// ===========================================
// BEISPIEL 8: Redaxo-Modul mit Aspect Ratio Auswahl
// ===========================================

/**
 * Für die Verwendung in Redaxo-Modulen mit Aspect Ratio Auswahl
 */

// Modul INPUT:
?>
<div class="form-group">
    <label>Video</label>
    REX_MEDIA[1]
</div>
<div class="form-group">
    <label>Video Titel</label>
    <input type="text" name="REX_INPUT_VALUE[1]" value="REX_VALUE[1]" class="form-control" />
</div>
<div class="form-group">
    <label>Seitenverhältnis</label>
    <select name="REX_INPUT_VALUE[2]" class="form-control">
        <option value="16 / 9" <?= 'REX_VALUE[2]' === '16 / 9' ? 'selected' : '' ?>>16:9 (Standard)</option>
        <option value="9 / 16" <?= 'REX_VALUE[2]' === '9 / 16' ? 'selected' : '' ?>>9:16 (Portrait)</option>
        <option value="4 / 3" <?= 'REX_VALUE[2]' === '4 / 3' ? 'selected' : '' ?>>4:3 (Klassisch)</option>
        <option value="1 / 1" <?= 'REX_VALUE[2]' === '1 / 1' ? 'selected' : '' ?>>1:1 (Quadrat)</option>
        <option value="21 / 9" <?= 'REX_VALUE[2]' === '21 / 9' ? 'selected' : '' ?>>21:9 (Ultra-Wide)</option>
    </select>
</div>

<?php
// Modul OUTPUT:
$videoFile = 'REX_MEDIA[1]';
$videoTitle = 'REX_VALUE[1]';
$aspectRatio = 'REX_VALUE[2]' ?: '16 / 9';

if ($videoFile) {
    $video = new Video($videoFile, $videoTitle);
    
    // Aspect Ratio setzen
    $video->setAspectRatio($aspectRatio);
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    echo $video->generateFull();
}

// ===========================================
// HINWEISE:
// ===========================================

/**
 * Verfügbare Seitenverhältnisse:
 * 
 * - 16 / 9  : Standard HD/4K (1920x1080, 3840x2160)
 * - 9 / 16  : Portrait/Vertical (1080x1920, Smartphone-Videos)
 * - 4 / 3   : Klassisches TV-Format (1024x768, 1600x1200)
 * - 1 / 1   : Quadratisch (1080x1080, Instagram-Posts)
 * - 21 / 9  : Ultra-Wide/Kino (2560x1080, 3440x1440)
 * - 3 / 2   : Klassisches Fotoformat (1920x1280)
 * - 5 / 4   : Quadratisch-ähnlich (1280x1024)
 * 
 * Das Seitenverhältnis wird als CSS Custom Property gesetzt und kann
 * über CSS Media Queries für responsive Designs angepasst werden.
 * 
 * Für Portrait-Videos wird empfohlen:
 * - Desktop: Maximale Breite begrenzen
 * - Mobile: Volle Breite verwenden
 */
?>