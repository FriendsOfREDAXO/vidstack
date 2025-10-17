<?php

namespace FriendsOfRedaxo\VidStack;

use rex_escape;
use rex_path;
use rex_url;
use rex_media;
use rex_extension;
use rex_extension_point;
use rex_i18n; 

class Video
{
    private readonly string $source;
    private string $title;
    private array $poster = [];
    private array $attributes = [];
    private string $a11yContent = '';
    private string $thumbnails = '';
    private array $subtitles = [];
    private string $lang;
    private static array $translations = [];
    
    // Neue Eigenschaften für Multiple Sources
    private array $sources = [];
    private bool $useMultipleSources = false;
    private array $sortedSources = []; // Cache für sortierte Sources

    public function __construct(string $source, string $title = '', string $lang = 'de')
    {
        $this->source = $source;
        $this->title = $title;
        $this->lang = $lang;
        $this->attributes['lang'] = $lang;
        $this->loadTranslations();
    }

    private static function getTranslationsFile(): string
    {
        return rex_path::addon('vidstack', 'lang/translations.php');
    }

    private function loadTranslations(): void
    {
        if (empty(self::$translations)) {
            $file = self::getTranslationsFile();
            if (file_exists($file)) {
                self::$translations = include $file;
            } else {
                throw new \RuntimeException("Translations file not found: $file");
            }
        }
    }

    private function getText(string $key): string
    {
        return self::$translations[$this->lang][$key] ?? "[[{$key}]]";
    }

    public function setAttributes(array $attributes): void
    {
        $this->attributes = array_merge($this->attributes, $attributes);
    }

    public function setA11yContent(string $description, string $alternativeUrl = ''): void
    {
        $alternativeUrl = $alternativeUrl ?: $this->getAlternativeUrl();

        $this->a11yContent = "<div class=\"video-description\">"
            . "<p>" . rex_escape($this->getText('video_description')) . ": " . $description . "</p></div>"
            . "<div class=\"alternative-links\">"
            . "<p>" . rex_escape($this->getText('video_alternative_view')) . ": <a href=\"" . rex_escape($alternativeUrl) . "\">"
            . rex_escape($this->getText('video_open_alternative_view')) . "</a></p>"
            . "</div>";
    }

    public function setThumbnails(string $thumbnailsUrl): void
    {
        $this->thumbnails = $thumbnailsUrl;
    }

    public function setPoster(string $posterSrc, string $posterAlt = ''): void
    {
        $this->poster = [
            'src' => $posterSrc,
            'alt' => $posterAlt
        ];
    }

    public function addSubtitle(string $src, string $kind, string $label, string $lang, bool $default = false): void
    {
        $this->subtitles[] = [
            'src' => $src,
            'kind' => $kind,
            'label' => $label,
            'lang' => $lang,
            'default' => $default
        ];
    }

    /**
     * Fügt mehrere Video-Quellen für verschiedene Auflösungen hinzu
     * 
     * @param array $sources Array mit Source-Objekten
     * Format: [
     *   ['src' => 'video-1080p.mp4', 'width' => 1920, 'height' => 1080, 'type' => 'video/mp4'],
     *   ['src' => 'video-720p.mp4', 'width' => 1280, 'height' => 720, 'type' => 'video/mp4']
     * ]
     * @param bool $autoSort Automatisch nach Qualität sortieren (default: true)
     */
    public function setSources(array $sources, bool $autoSort = true): void
    {
        $this->sources = $sources;
        $this->useMultipleSources = !empty($sources);
        $this->sortedSources = []; // Cache leeren
        
        if ($autoSort && $this->useMultipleSources) {
            $this->sortSourcesByQuality();
        }
    }

    /**
     * Sortiert Sources nach Qualität (höchste zuerst) und cached das Ergebnis
     */
    private function sortSourcesByQuality(): void
    {
        if (empty($this->sortedSources)) {
            $this->sortedSources = $this->sources;
            usort($this->sortedSources, function($a, $b) {
                $aWidth = $a['width'] ?? 0;
                $bWidth = $b['width'] ?? 0;
                
                // Primär nach Breite sortieren
                if ($aWidth !== $bWidth) {
                    return $bWidth <=> $aWidth;
                }
                
                // Sekundär nach Höhe sortieren falls Breite gleich
                $aHeight = $a['height'] ?? 0;
                $bHeight = $b['height'] ?? 0;
                return $bHeight <=> $aHeight;
            });
        }
    }

    /**
     * Convenience-Methode für Desktop/Mobile Setup
     * 
     * @param string $desktopSource Hochauflösende Version für Desktop
     * @param string $mobileSource Mobile-optimierte Version
     * @param array $desktopResolution [width, height] für Desktop (default: [1920, 1080])
     * @param array $mobileResolution [width, height] für Mobile (default: [854, 480])
     */
    public function setResponsiveSources(
        string $desktopSource, 
        string $mobileSource, 
        array $desktopResolution = [1920, 1080], 
        array $mobileResolution = [854, 480]
    ): void {
        $sources = [];
        
        // Desktop-Version (höhere Auflösung)
        if ($desktopSource) {
            $sources[] = [
                'src' => $desktopSource,
                'width' => $desktopResolution[0] ?? 1920,
                'height' => $desktopResolution[1] ?? 1080,
                'type' => $this->getMediaType($desktopSource)
            ];
        }
        
        // Mobile-Version (niedrigere Auflösung)
        if ($mobileSource) {
            $sources[] = [
                'src' => $mobileSource,
                'width' => $mobileResolution[0] ?? 854,
                'height' => $mobileResolution[1] ?? 480,
                'type' => $this->getMediaType($mobileSource)
            ];
        }
        
        $this->setSources($sources);
    }

    /**
     * Ermittelt den Media-Type basierend auf der Dateiendung
     */
    private function getMediaType(string $source): string
    {
        if (self::isAudio($source)) {
            return 'audio/mp3';
        }
        
        $extension = strtolower(pathinfo($source, PATHINFO_EXTENSION));
        
        return match($extension) {
            'mp4', 'm4v' => 'video/mp4',
            'webm' => 'video/webm',
            'ogg', 'ogv' => 'video/ogg',
            'mov' => 'video/quicktime',
            default => 'video/mp4'
        };
    }

    /**
     * Generiert die Source-Elemente für Multiple Sources
     */
    private function generateSourceElements(): string
    {
        if (!$this->useMultipleSources || empty($this->sources)) {
            // Fallback auf Single Source
            $sourceUrl = $this->getSourceUrl();
            $isAudio = self::isAudio($this->source);
            return "<source src=\"" . rex_escape($sourceUrl) . "\" type=\"" . ($isAudio ? "audio/mp3" : "video/mp4") . "\" />";
        }
        
        $sourceElements = '';
        
        // Verwende gecachte sortierte Sources oder sortiere einmalig
        $this->sortSourcesByQuality();
        $sourcesToUse = $this->sortedSources;
        
        foreach ($sourcesToUse as $source) {
            $src = $this->getSourceUrlFromSource($source['src']);
            $type = $source['type'] ?? $this->getMediaType($source['src']);
            $width = $source['width'] ?? null;
            $height = $source['height'] ?? null;
            
            $sourceElements .= "<source src=\"" . rex_escape($src) . "\" type=\"" . rex_escape($type) . "\"";
            
            if ($width && $height) {
                $sourceElements .= " width=\"" . (int)$width . "\" height=\"" . (int)$height . "\"";
            }
            
            $sourceElements .= " />";
        }
        
        return $sourceElements;
    }

    /**
     * Hilfsmethode um Source-URL zu generieren
     */
    private function getSourceUrlFromSource(string $source): string
    {
        if (filter_var($source, FILTER_VALIDATE_URL)) {
            return $source;
        }
        return rex_url::media($source);
    }

    /**
     * Retrieves the source URL of the video.
     *
     * If the source is a valid URL, it is returned as-is. Otherwise, it is treated as a media file
     * and its URL is generated using the `rex_url::media` method.
     *
     * @return string The source URL of the video.
     */
    public function getSourceUrl(): string
    {
        if (filter_var($this->source, FILTER_VALIDATE_URL)) {
            return $this->source;
        }
        return rex_url::media($this->source);
    }

    public function getAlternativeUrl(): string
    {
        return $this->getSourceUrl();
    }

    public static function isMedia($url): bool
    {
        $mediaExtensions = ['mp4', 'mov', 'm4v', 'ogg', 'webm', 'mp3', 'wav', 'aac', 'm4a'];

        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $pathInfo = pathinfo(parse_url($url, PHP_URL_PATH));
        } else {
            $media = rex_media::get($url);
            if (!$media) {
                return false;
            }
            $pathInfo = pathinfo($media->getFileName());
        }

        return in_array(strtolower($pathInfo['extension'] ?? ''), $mediaExtensions);
    }

    public static function isAudio($url): bool
    {
        $audioExtensions = ['mp3', 'ogg', 'wav', 'aac', 'm4a'];

        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $pathInfo = pathinfo(parse_url($url, PHP_URL_PATH));
        } else {
            $media = rex_media::get($url);
            if (!$media) {
                return false;
            }
            $pathInfo = pathinfo($media->getFileName());
        }

        return in_array(strtolower($pathInfo['extension'] ?? ''), $audioExtensions);
    }

    public static function getVideoInfo(string $source): array
    {
        $youtubePattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=|shorts/)|youtu\.be/)([^"&?/ ]{11})%i';
        if (preg_match($youtubePattern, $source, $match)) {
            return ['platform' => 'youtube', 'id' => $match[1]];
        }
        $vimeoPattern = '~(?:<iframe [^>]*src=")?(?:https?:\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w]*\/(progressive_redirect\/playback|external|videos?))?\/([0-9]+)[^\s]*)"?(?:[^>]*></iframe>)?(?:<p>.*</p>)?~ix';
        if (preg_match($vimeoPattern, $source, $match)) {
            return ['platform' => 'vimeo', 'id' => $match[2]];
        }
        return ['platform' => 'default', 'id' => ''];
    }
    
    public static function isPlayable($source): bool
    {
        // Check for local media files
        if (self::isMedia($source)) {
            return true;
        }

        // Check for YouTube or Vimeo videos
        $videoInfo = self::getVideoInfo($source);
        if ($videoInfo['platform'] === 'youtube' || $videoInfo['platform'] === 'vimeo') {
            return true;
        }

        // If none of the above conditions are met, it's not a playable media
        return false;
    }

    public function generateFull(): string
    {
        $videoInfo = self::getVideoInfo($this->source);
        $isAudio = self::isAudio($this->source);
        $mediaType = $isAudio ? 'audio' : 'video';

        $code = "<div class=\"{$mediaType}-container\" role=\"region\" aria-label=\"" . rex_escape($this->getText("a11y_{$mediaType}_player")) . "\">";

        // Consent Manager Integration für YouTube/Vimeo
        $playerCode = $this->generate();
        
        if (!$isAudio && $videoInfo['platform'] !== 'default' && class_exists('consent_manager_inline')) {
            // Consent Manager verfügbar - Inline-Consent nutzen
            $serviceKey = strtolower($videoInfo['platform']); // 'youtube' oder 'vimeo'
            
            // Optionen für Consent Manager
            $consentOptions = [
                'title' => $this->title ?: ucfirst($videoInfo['platform']) . ' Video',
                'width' => 'auto',
                'height' => 'auto',
            ];
            
            // Poster-Bild als Thumbnail nutzen, falls vorhanden
            if (!empty($this->poster['src'])) {
                $consentOptions['thumbnail'] = $this->poster['src'];
            }
            
            // Consent Manager Inline-Consent verwenden
            $playerCode = consent_manager_inline::doConsent($serviceKey, $playerCode, $consentOptions);
        }
        
        $code .= $playerCode;

        if (!$isAudio && $this->a11yContent) {
            $code .= "<div class=\"a11y-content\" role=\"complementary\" aria-label=\"" . rex_escape($this->getText('a11y_additional_information')) . "\">" 
                . $this->a11yContent
                . "</div>";
        }

        $code .= "</div>";
        return $code;
    }    public function generate(): string
    {
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"" . rex_escape($this->title) . "\"" : '';
        $sourceUrl = $this->getSourceUrl();
        $isAudio = self::isAudio($this->source);
        $mediaType = $isAudio ? 'audio' : 'video';
        $videoInfo = self::getVideoInfo($this->source);

        $code = "<media-player{$titleAttr}{$attributesString}";

        // Set src for all video types (YouTube, Vimeo, local)
        $code .= " src=\"" . rex_escape($sourceUrl) . "\"";
        
        // Add aria-label for accessibility
        if (!$isAudio && $videoInfo['platform'] !== 'default') {
            $code .= " aria-label=\"" . rex_escape($this->getText('a11y_video_from')) . " " . rex_escape($videoInfo['platform']) . "\"";
        } else {
            $ariaLabel = $this->title ?: $this->getText("a11y_{$mediaType}_player");
            $code .= " aria-label=\"" . rex_escape($ariaLabel) . "\"";
        }

        $code .= " crossorigin>";

        $code .= "<media-provider>";

        if (!$isAudio && !empty($this->poster)) {
            // Use title as fallback alt text if poster alt is empty for accessibility
            $posterAlt = !empty($this->poster['alt']) ? $this->poster['alt'] : (!empty($this->title) ? $this->title : $this->getText('a11y_video_poster'));
            $code .= "<media-poster class=\"vds-poster\" src=\"" . rex_escape($this->poster['src']) . "\" alt=\"" . rex_escape($posterAlt) . "\"></media-poster>";
        }

        if ($videoInfo['platform'] === 'default') {
            $code .= $this->generateSourceElements();
        }

        // Move subtitles inside <media-provider>
        if (!$isAudio) {
            foreach ($this->subtitles as $subtitle) {
                $defaultAttr = $subtitle['default'] ? ' default' : '';
                $code .= "<track src=\"" . rex_escape($subtitle['src']) . "\" kind=\"" . rex_escape($subtitle['kind']) . "\" label=\"" . rex_escape($subtitle['label']) . "\" srclang=\"" . rex_escape($subtitle['lang']) . "\"{$defaultAttr} />";
            }
        }

        $code .= "</media-provider>";

        $code .= $isAudio ? "<media-audio-layout></media-audio-layout>" :
            "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"" . rex_escape($this->thumbnails) . "\"" : "") . "></media-video-layout>";
        $code .= "</media-player>";
        return $code;
    }

    public function generateAttributesString(): string
    {
        return array_reduce(array_keys($this->attributes), function ($carry, $key) {
            $value = $this->attributes[$key];
            return $carry . (is_bool($value) ? ($value ? " " . rex_escape($key) : '') : " " . rex_escape($key) . "=\"" . rex_escape($value) . "\"");
        }, '');
    }

    public static function videoOembedHelper(): void
    {
        rex_extension::register('OUTPUT_FILTER', static function (rex_extension_point $ep) {
            $content = $ep->getSubject();
            return self::parseOembedTags($content);
        }, rex_extension::LATE);
    }

    public static function parseOembedTags(string $content): string
    {
        return preg_replace_callback('/<oembed url="(.+?)"><\/oembed>/is', static function ($match) {
            $video = new self($match[1]);
            $videoInfo = self::getVideoInfo($match[1]);
            
            // For YouTube/Vimeo videos, don't use native controls - let Vidstack handle the UI
            if ($videoInfo['platform'] === 'youtube' || $videoInfo['platform'] === 'vimeo') {
                $video->setAttributes([
                    'crossorigin' => '',
                    'playsinline' => true,
                    'controls' => false  // Important: disable native controls for embed videos
                ]);
            } else {
                // For regular video files, use native controls
                $video->setAttributes([
                    'crossorigin' => '',
                    'playsinline' => true,
                    'controls' => true
                ]);
            }
            
            return $video->generateFull();
        }, $content);
    }

    // Fixed method with correct type hint
    public static function show_sidebar(rex_extension_point $ep): ?string
    {
        $params = $ep->getParams();
        $file = $params['filename'];

        $existingContent = $ep->getSubject();

        if (self::isMedia($file)) {
            $isAudio = self::isAudio($file);
            $mediaUrl = rex_url::media($file);

            if ($isAudio) {
                $newContent = "<media-player src=\"" . rex_escape($mediaUrl) . "\">"
                    . "<media-provider></media-provider>"
                    . "<media-audio-layout></media-audio-layout>"
                    . "</media-player>";
            } else {
                $media = new self($file);
                $media->setAttributes([
                    'crossorigin' => '',
                    'playsinline' => true,
                    'controls' => true
                ]);
                $newContent = $media->generate();
            }

            // Video-Informationen hinzufügen, wenn FFmpeg-AddOn verfügbar ist
            $videoInfo = self::getFFmpegVideoInfo($file);
            if ($videoInfo) {
                $newContent .= $videoInfo;
            }

            return $existingContent . $newContent;
        }

        return $existingContent;
    }

    /**
     * Video-Informationen für die Sidebar abrufen und formatieren
     * 
     * @param string $filename Dateiname der Video-Datei
     * @return string|null HTML mit Video-Informationen oder null
     */
    private static function getFFmpegVideoInfo(string $filename): ?string
    {
        // Prüfen ob FFmpeg-AddOn verfügbar ist
        $ffmpegAddon = \rex_addon::get('ffmpeg');
        if (!$ffmpegAddon->isAvailable()) {
            return null;
        }

        // Nur für Video-Dateien Informationen anzeigen
        if (self::isAudio($filename)) {
            return null;
        }

        try {
            // Video-Informationen über FFmpeg-AddOn abrufen
            $videoInfo = \FriendsOfRedaxo\FFmpeg\VideoInfo::getBasicInfo($filename);
            
            if (!$videoInfo) {
                return null;
            }

            // Kompakte HTML-Ausgabe der Video-Informationen
            $html = '<div class="vidstack-video-info">';
            $html .= '<h4>' . rex_i18n::msg('vidstack_video_info_title') . '</h4>';
            
            // Dimensionen
            if ($videoInfo['width'] && $videoInfo['height']) {
                $html .= '<div><strong>' . rex_i18n::msg('vidstack_video_info_resolution') . ':</strong> ' . 
                         rex_escape($videoInfo['width']) . ' × ' . rex_escape($videoInfo['height']) . ' px';
                if ($videoInfo['aspect_ratio']) {
                    $html .= ' (' . rex_escape($videoInfo['aspect_ratio']) . ')';
                }
                $html .= '</div>';
            }
            
            // Codec
            if ($videoInfo['video_codec']) {
                $html .= '<div><strong>' . rex_i18n::msg('vidstack_video_info_codec') . ':</strong> ' . 
                         rex_escape(strtoupper($videoInfo['video_codec'])) . '</div>';
            }
            
            // Dauer
            if ($videoInfo['duration_formatted']) {
                $html .= '<div><strong>' . rex_i18n::msg('vidstack_video_info_duration') . ':</strong> ' . 
                         rex_escape($videoInfo['duration_formatted']) . '</div>';
            }
            
            // Dateigröße
            if ($videoInfo['filesize_formatted']) {
                $html .= '<div><strong>' . rex_i18n::msg('vidstack_video_info_filesize') . ':</strong> ' . 
                         rex_escape($videoInfo['filesize_formatted']) . '</div>';
            }
            
            // Bitrate (optional, nur bei sinnvollen Werten)
            if ($videoInfo['bitrate_formatted'] && $videoInfo['bitrate'] > 0) {
                $html .= '<div><strong>' . rex_i18n::msg('vidstack_video_info_bitrate') . ':</strong> ' . 
                         rex_escape($videoInfo['bitrate_formatted']) . '</div>';
            }
            
            // Action-Buttons für FFmpeg-Tools hinzufügen
            $html .= self::generateFFmpegActionButtons($filename);
            
            $html .= '</div>';
            
            return $html;
            
        } catch (\Exception $e) {
            // Bei Fehlern stillschweigend ignorieren
            return null;
        }
    }

    /**
     * Generiert Action-Buttons für FFmpeg-Tools
     * 
     * @param string $filename Dateiname der Video-Datei
     * @return string HTML mit Action-Buttons
     */
    private static function generateFFmpegActionButtons(string $filename): string
    {
        // Zusätzliche Prüfung: Sind die FFmpeg-Seiten verfügbar?
        $ffmpegAddon = \rex_addon::get('ffmpeg');
        if (!$ffmpegAddon->isAvailable()) {
            return '';
        }

        $buttons = '<div class="vidstack-action-buttons">';
        $buttons .= '<div class="vidstack-action-buttons-label"><strong>' . rex_i18n::msg('vidstack_video_tools') . ':</strong></div>';
        $buttons .= '<div class="vidstack-action-buttons-group">';
        
        // Trimmer-Button
        $trimmerUrl = rex_url::backendPage('mediapool/ffmpeg/trimmer') . '&video=' . urlencode($filename);
        $buttons .= '<a href="' . rex_escape($trimmerUrl) . '" class="btn btn-xs btn-primary vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_trim_title') . '">';
        $buttons .= '<i class="rex-icon fa-cut"></i> ' . rex_i18n::msg('vidstack_tool_trim') . '</a>';
        
        // Optimieren-Button (zur Haupt-FFmpeg-Seite)
        $optimizeUrl = rex_url::backendPage('mediapool/ffmpeg') . '&video=' . urlencode($filename);
        $buttons .= '<a href="' . rex_escape($optimizeUrl) . '" class="btn btn-xs btn-success vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_optimize_title') . '">';
        $buttons .= '<i class="rex-icon fa-compress"></i> ' . rex_i18n::msg('vidstack_tool_optimize') . '</a>';
        
        // Info-Button
        $infoUrl = rex_url::backendPage('mediapool/ffmpeg/info') . '&video=' . urlencode($filename);
        $buttons .= '<a href="' . rex_escape($infoUrl) . '" class="btn btn-xs btn-info vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_details_title') . '">';
        $buttons .= '<i class="rex-icon fa-info-circle"></i> ' . rex_i18n::msg('vidstack_tool_details') . '</a>';
        
        $buttons .= '</div></div>';
        
        return $buttons;
    }

    /**
     * Vordefinierte Auflösungspresets für gängige Anwendungsfälle
     */
    public static function getResolutionPresets(): array
    {
        return [
            '4k' => [3840, 2160],
            '2k' => [2560, 1440],
            '1080p' => [1920, 1080],
            '720p' => [1280, 720],
            '480p' => [854, 480],
            '360p' => [640, 360],
            '240p' => [426, 240],
            'mobile_hd' => [960, 540],
            'mobile_sd' => [640, 360],
            'tablet' => [1024, 576],
        ];
    }

    /**
     * Erweiterte responsive Sources mit Presets
     * 
     * @param string $desktopSource Desktop Video
     * @param string $mobileSource Mobile Video
     * @param string $desktopPreset Preset-Name für Desktop (z.B. '1080p')
     * @param string $mobilePreset Preset-Name für Mobile (z.B. '480p')
     */
    public function setResponsiveSourcesWithPresets(
        string $desktopSource, 
        string $mobileSource, 
        string $desktopPreset = '1080p', 
        string $mobilePreset = '480p'
    ): void {
        $presets = self::getResolutionPresets();
        
        $desktopResolution = $presets[$desktopPreset] ?? $presets['1080p'];
        $mobileResolution = $presets[$mobilePreset] ?? $presets['480p'];
        
        $this->setResponsiveSources($desktopSource, $mobileSource, $desktopResolution, $mobileResolution);
    }

    /**
     * Erstellt Sources automatisch aus einem Basis-Dateinamen
     * 
     * @param string $baseFilename Basis-Dateiname ohne Suffix (z.B. 'video')
     * @param array $qualityLevels Array von Qualitätsstufen mit Suffixen
     * @param string $extension Dateierweiterung (default: 'mp4')
     * 
     * Beispiel: createAutoSources('video', ['1080p' => [1920, 1080], '720p' => [1280, 720]])
     * Sucht nach: video-1080p.mp4, video-720p.mp4
     */
    public function createAutoSources(
        string $baseFilename, 
        array $qualityLevels = null, 
        string $extension = 'mp4'
    ): bool {
        if ($qualityLevels === null) {
            $qualityLevels = [
                '1080p' => [1920, 1080],
                '720p' => [1280, 720],
                '480p' => [854, 480]
            ];
        }
        
        $sources = [];
        $foundAny = false;
        
        foreach ($qualityLevels as $suffix => $resolution) {
            $filename = $baseFilename . '-' . $suffix . '.' . $extension;
            
            // Prüfen ob Datei existiert (für REDAXO Media)
            if (rex_media::get($filename)) {
                $sources[] = [
                    'src' => $filename,
                    'width' => $resolution[0],
                    'height' => $resolution[1],
                    'type' => $this->getMediaType($filename)
                ];
                $foundAny = true;
            }
        }
        
        if ($foundAny) {
            $this->setSources($sources);
            return true;
        }
        
        return false;
    }
}
