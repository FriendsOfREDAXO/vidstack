<?php
/**
 * BEISPIELE für Source Sizes mit dem erweiterten Vidstack-Addon
 * 
 * Diese Datei zeigt verschiedene Implementierungsansätze für 
 * Desktop/Mobile Video-Auflösungen mit dem Redaxo Vidstack-Addon
 */

use FriendsOfRedaxo\VidStack\Video;

// ===========================================
// BEISPIEL 1: Einfache Desktop/Mobile Quellen
// ===========================================

/**
 * Einfachste Methode: Eine Desktop- und eine Mobile-Version
 */
function createResponsiveVideo($desktopVideo, $mobileVideo, $title = '') {
    $video = new Video($desktopVideo, $title);
    
    // Responsive Sources setzen
    $video->setResponsiveSources($desktopVideo, $mobileVideo);
    
    // Optional: Weitere Attribute
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

/**
 * Mit benutzerdefinierten Auflösungen
 */
function createCustomResolutionVideo($desktopVideo, $mobileVideo, $title = '') {
    $video = new Video($desktopVideo, $title);
    
    // Custom Auflösungen: 2K Desktop, Mobile HD
    $video->setResponsiveSources(
        $desktopVideo, 
        $mobileVideo,
        [2560, 1440], // Desktop: 2K
        [960, 540]    // Mobile: Mobile HD  
    );
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

/**
 * Mit Auflösungspresets
 */
function createPresetVideo($desktopVideo, $mobileVideo, $title = '') {
    $video = new Video($desktopVideo, $title);
    
    // Verwende vordefinierte Presets
    $video->setResponsiveSourcesWithPresets($desktopVideo, $mobileVideo, '2k', 'mobile_hd');
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung im Template:
echo createResponsiveVideo('video-1080p.mp4', 'video-480p.mp4', 'Mein responsives Video');
echo createCustomResolutionVideo('video-2k.mp4', 'video-mobile.mp4', 'Custom Resolution Video');
echo createPresetVideo('video-high.mp4', 'video-low.mp4', 'Preset Video');

// ===========================================
// BEISPIEL 2: Mehrere Qualitätsstufen
// ===========================================

/**
 * Erweiterte Methode: Mehrere Qualitätsstufen für optimale Auswahl
 */
function createMultiQualityVideo($sources, $title = '') {
    // Basis-Video (für Fallback und Platform-Detection)
    $primarySource = $sources[0]['src'] ?? '';
    $video = new Video($primarySource, $title);
    
    // Alle Quellen hinzufügen
    $video->setSources($sources);
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung mit mehreren Qualitäten:
$qualitySources = [
    [
        'src' => 'video-1080p.mp4',
        'width' => 1920,
        'height' => 1080,
        'type' => 'video/mp4'
    ],
    [
        'src' => 'video-720p.mp4', 
        'width' => 1280,
        'height' => 720,
        'type' => 'video/mp4'
    ],
    [
        'src' => 'video-480p.mp4',
        'width' => 854,
        'height' => 480,
        'type' => 'video/mp4'
    ]
];

echo createMultiQualityVideo($qualitySources, 'Multi-Quality Video');

// ===========================================
// BEISPIEL 3: Redaxo-Integration mit Modulen
// ===========================================

/**
 * Für die Verwendung in Redaxo-Modulen
 * REX_MEDIA[1] = Desktop Video
 * REX_MEDIA[2] = Mobile Video  
 * REX_VALUE[1] = Video Titel
 */

// Modul INPUT:
?>
<div class="form-group">
    <label>Video Desktop (HD)</label>
    REX_MEDIA[1]
</div>
<div class="form-group">
    <label>Video Mobile</label>
    REX_MEDIA[2]
</div>
<div class="form-group">
    <label>Video Titel</label>
    <input type="text" name="REX_INPUT_VALUE[1]" value="REX_VALUE[1]" class="form-control" />
</div>

<?php
// Modul OUTPUT:
$desktopVideo = 'REX_MEDIA[1]';
$mobileVideo = 'REX_MEDIA[2]';
$videoTitle = 'REX_VALUE[1]';

if ($desktopVideo) {
    $video = new Video($desktopVideo, $videoTitle);
    
    // Wenn mobile Version vorhanden, responsive sources verwenden
    if ($mobileVideo) {
        $video->setResponsiveSources($desktopVideo, $mobileVideo);
    }
    
    // Poster hinzufügen falls vorhanden
    // $video->setPoster('poster.jpg', 'Video Poster');
    
    // Attributes setzen
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    echo $video->generateFull();
}

// ===========================================
// BEISPIEL 4: Programmgesteuerte Auswahl
// ===========================================

/**
 * Intelligente Auswahl basierend auf verfügbaren Medien
 */
function createSmartResponsiveVideo($baseFilename, $title = '') {
    // Verschiedene Varianten suchen
    $variants = [
        ['suffix' => '-1080p', 'width' => 1920, 'height' => 1080],
        ['suffix' => '-720p', 'width' => 1280, 'height' => 720], 
        ['suffix' => '-480p', 'width' => 854, 'height' => 480],
        ['suffix' => '', 'width' => 1280, 'height' => 720] // Fallback original
    ];
    
    $sources = [];
    $primarySource = '';
    
    foreach ($variants as $variant) {
        $filename = $baseFilename . $variant['suffix'] . '.mp4';
        
        // Prüfen ob Datei existiert (vereinfacht)
        if (rex_media::get($filename)) {
            $sources[] = [
                'src' => $filename,
                'width' => $variant['width'],
                'height' => $variant['height'],
                'type' => 'video/mp4'
            ];
            
            if (!$primarySource) {
                $primarySource = $filename;
            }
        }
    }
    
    if (!$primarySource) {
        return '<!-- Kein Video gefunden für: ' . $baseFilename . ' -->';
    }
    
    $video = new Video($primarySource, $title);
    
    if (count($sources) > 1) {
        $video->setSources($sources);
    }
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Verwendung:
echo createSmartResponsiveVideo('mein-video', 'Automatisch optimiertes Video');

// ===========================================
// BEISPIEL 5: Mit zusätzlichen Features
// ===========================================

/**
 * Vollausgestattete Implementierung mit allen Features
 */
function createFullFeaturedVideo($sources, $config = []) {
    $primarySource = $sources[0]['src'] ?? '';
    $video = new Video($primarySource, $config['title'] ?? '');
    
    // Multiple sources
    if (count($sources) > 1) {
        $video->setSources($sources);
    }
    
    // Poster
    if (!empty($config['poster'])) {
        $video->setPoster($config['poster'], $config['poster_alt'] ?? '');
    }
    
    // Thumbnails für Scrubbing
    if (!empty($config['thumbnails'])) {
        $video->setThumbnails($config['thumbnails']);
    }
    
    // Untertitel
    if (!empty($config['subtitles'])) {
        foreach ($config['subtitles'] as $subtitle) {
            $video->addSubtitle(
                $subtitle['src'],
                $subtitle['kind'] ?? 'subtitles',
                $subtitle['label'],
                $subtitle['lang'],
                $subtitle['default'] ?? false
            );
        }
    }
    
    // A11y Content
    if (!empty($config['description'])) {
        $video->setA11yContent($config['description']);
    }
    
    // Attribute
    $defaultAttributes = [
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ];
    
    $video->setAttributes(array_merge($defaultAttributes, $config['attributes'] ?? []));
    
    return $video->generateFull();
}

// Verwendung:
$fullConfig = [
    'title' => 'Vollausgestattetes Video',
    'poster' => 'video-poster.jpg',
    'poster_alt' => 'Video Vorschaubild',
    'thumbnails' => 'video-thumbnails.vtt',
    'description' => 'Detaillierte Beschreibung des Videos für Barrierefreiheit',
    'subtitles' => [
        [
            'src' => 'subtitles-de.vtt',
            'label' => 'Deutsch',
            'lang' => 'de', 
            'default' => true
        ],
        [
            'src' => 'subtitles-en.vtt',
            'label' => 'English',
            'lang' => 'en'
        ]
    ],
    'attributes' => [
        'autoplay' => false,
        'muted' => false,
        'loop' => false
    ]
];

echo createFullFeaturedVideo($qualitySources, $fullConfig);

// ===========================================
// BEISPIEL 1.5: Automatische Source-Erstellung
// ===========================================

/**
 * Automatische Erstellung aus Dateinamen-Pattern
 */
function createAutoSourceVideo($baseFilename, $title = '') {
    $video = new Video($baseFilename . '.mp4', $title);
    
    // Versuche automatisch verschiedene Qualitäten zu finden
    if ($video->createAutoSources($baseFilename)) {
        // Erfolgreich - verschiedene Qualitäten gefunden
        $video->setAttributes([
            'crossorigin' => '',
            'playsinline' => true,
            'controls' => true,
            'preload' => 'metadata'
        ]);
        return $video->generateFull();
    } else {
        // Fallback auf Basis-Video
        return $video->generateFull();
    }
}

// Verwendung:
// Sucht automatisch nach: produktvideo-1080p.mp4, produktvideo-720p.mp4, produktvideo-480p.mp4
echo createAutoSourceVideo('produktvideo', 'Produktvideo mit Auto-Qualitäten');

// Mit benutzerdefinierten Qualitätsstufen:
function createCustomAutoVideo($baseFilename, $title = '') {
    $video = new Video($baseFilename . '.mp4', $title);
    
    $customQualities = [
        '4k' => [3840, 2160],
        '1080p' => [1920, 1080], 
        '720p' => [1280, 720],
        'mobile' => [854, 480]
    ];
    
    if ($video->createAutoSources($baseFilename, $customQualities)) {
        return $video->generateFull();
    }
    
    return $video->generateFull();
}

// ===========================================
// BEISPIEL 1.6: Performance-Optimierung
// ===========================================

/**
 * Performance-optimierte Version mit Caching
 */
function createOptimizedVideo($sources, $title = '') {
    $primarySource = $sources[0]['src'] ?? '';
    $video = new Video($primarySource, $title);
    
    // Sources setzen ohne automatisches Sorting (autoSort = false)
    // Falls die Sources bereits korrekt sortiert sind
    $video->setSources($sources, false);
    
    $video->setAttributes([
        'crossorigin' => '',
        'playsinline' => true,
        'controls' => true,
        'preload' => 'metadata'
    ]);
    
    return $video->generateFull();
}

// Bereits sortierte Sources (höchste Qualität zuerst)
$sortedSources = [
    ['src' => 'video-4k.mp4', 'width' => 3840, 'height' => 2160, 'type' => 'video/mp4'],
    ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
    ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4']
];

echo createOptimizedVideo($sortedSources, 'Performance-Optimiertes Video');

// ===========================================
// HINWEISE zur Vidstack-Dokumentation:
// ===========================================

/**
 * Laut Vidstack-Dokumentation wird empfohlen:
 * 
 * 1. HLS/DASH für adaptive Streaming zu verwenden statt statische Dateien
 * 2. Die Qualitäten werden automatisch basierend auf Netzwerk/Device gewählt
 * 3. Der Browser wählt die beste verfügbare Quelle aus den <source>-Elementen
 * 
 * Für einfache Anwendungsfälle (Desktop/Mobile) ist die Source Sizes 
 * Implementierung völlig ausreichend.
 * 
 * Das generierte HTML sieht so aus:
 * 
 * <media-player>
 *   <media-provider>
 *     <source src="video-1080p.mp4" type="video/mp4" width="1920" height="1080" />
 *     <source src="video-720p.mp4" type="video/mp4" width="1280" height="720" />
 *     <source src="video-480p.mp4" type="video/mp4" width="854" height="480" />
 *   </media-provider>
 *   <media-video-layout></media-video-layout>
 * </media-player>
 */
