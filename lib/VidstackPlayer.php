<?php

/**
 * Vidstack Player for REDAXO
 * Modern media player (video & audio) with method chaining and full Vidstack.io support.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 * @see https://vidstack.io/docs/wc/player/
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use rex_url;

use const FILTER_VALIDATE_URL;

class VidstackPlayer
{
    private string $source;
    private string $title = '';
    private string $lang = 'de';
    /** @var array<string, mixed> */
    private array $attributes = [];
    /** @var array{src?: string, alt?: string} */
    private array $poster = [];
    /** @var array<int, array{src: string, kind: string, label: string, srclang: string, default: bool}> */
    private array $tracks = [];
    private ?string $aspectRatio = null;
    private ?string $thumbnails = null;
    /** @var array<int, array{src: string, type?: string, width?: int, height?: int}> */
    private array $sources = [];

    // Platform detection cache
    /** @var array{platform: string, id: string}|null */
    private ?array $platformInfo = null;

    public function __construct(string $source)
    {
        $this->source = $source;
    }

    // ==========================================
    // FLUENT API (Method Chaining)
    // ==========================================

    /**
     * Set player title.
     *
     * @param string $title Title of the video/audio
     */
    public function title(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Set player language.
     *
     * @param string $lang Language code (e.g., 'de', 'en')
     */
    public function lang(string $lang): self
    {
        $this->lang = $lang;
        return $this;
    }

    /**
     * Set poster image for video.
     *
     * @param string $src Poster image URL or filename
     * @param string $alt Alt text for poster image
     */
    public function poster(string $src, string $alt = ''): self
    {
        $this->poster = ['src' => $src, 'alt' => $alt];
        return $this;
    }

    /**
     * Set aspect ratio.
     *
     * @param string $ratio Aspect ratio (e.g., '16/9', '4/3', '21/9')
     */
    public function aspectRatio(string $ratio): self
    {
        $this->aspectRatio = $ratio;
        return $this;
    }

    /**
     * Set thumbnail track (VTT file with preview thumbnails).
     *
     * @param string $url URL to WebVTT thumbnail file
     */
    public function thumbnails(string $url): self
    {
        $this->thumbnails = $url;
        return $this;
    }

    /**
     * Set multiple HTML attributes.
     *
     * @param array<string, mixed> $attributes Associative array of attributes
     */
    public function attributes(array $attributes): self
    {
        $this->attributes = array_merge($this->attributes, $attributes);
        return $this;
    }

    /**
     * Set single attribute.
     *
     * @param string $key Attribute name
     * @param mixed $value Attribute value
     */
    public function attr(string $key, mixed $value): self
    {
        $this->attributes[$key] = $value;
        return $this;
    }

    /**
     * Add subtitle/caption track.
     *
     * @param string $src VTT file URL or filename
     * @param string $label Track label (e.g., "English", "Deutsch")
     * @param string $srclang Language code (e.g., "en", "de")
     * @param string $kind Track kind: subtitles|captions|descriptions|chapters|metadata
     * @param bool $default Set as default track
     */
    public function track(string $src, string $label, string $srclang, string $kind = 'subtitles', bool $default = false): self
    {
        $this->tracks[] = [
            'src' => $src,
            'kind' => $kind,
            'label' => $label,
            'srclang' => $srclang,
            'default' => $default,
        ];
        return $this;
    }

    /**
     * Add multiple video sources for adaptive quality switching.
     *
     * @param array<int, array{src: string, type?: string, width?: int, height?: int}> $sources Array of source definitions
     */
    public function multipleSources(array $sources): self
    {
        $this->sources = $sources;
        return $this;
    }

    // ==========================================
    // RENDERING
    // ==========================================

    /**
     * Render the player HTML.
     *
     * @return string HTML markup for the media player
     */
    public function render(): string
    {
        $info = $this->getPlatformInfo();
        $isAudio = PlatformDetector::isAudio($this->source);

        return $this->generatePlayer($info, $isAudio);
    }

    /**
     * Magic method to convert player to string.
     *
     * @return string HTML markup for the media player
     */
    public function __toString(): string
    {
        return $this->render();
    }

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    /**
     * @param array{platform: string, id: string} $info
     */
    private function generatePlayer(array $info, bool $isAudio): string
    {
        $attrs = $this->buildAttributes($info, $isAudio);
        $ariaLabel = $this->buildAriaLabel($info, $isAudio);

        $parts = ["<media-player{$attrs} aria-label=\"{$ariaLabel}\">", '<media-provider>'];

        // Poster
        if (!$isAudio && !empty($this->poster['src'])) {
            $posterAlt = $this->poster['alt'] ?? $this->title ?: Translator::get('a11y_video_poster', $this->lang);
            $parts[] = '<media-poster src="' . rex_escape($this->getMediaUrl($this->poster['src'])) . '" alt="' . rex_escape($posterAlt) . '"></media-poster>';
        }

        // Sources (only for local media, not YouTube/Vimeo)
        if ('local' === $info['platform']) {
            $parts[] = $this->generateSources($isAudio);
        }

        // Tracks
        foreach ($this->tracks as $track) {
            $parts[] = $this->generateTrack($track);
        }

        $parts[] = '</media-provider>';

        // Layout
        $parts[] = $isAudio ? '<media-audio-layout></media-audio-layout>' : $this->generateVideoLayout();

        $parts[] = '</media-player>';

        return implode('', $parts);
    }

    /**
     * @param array{platform: string, id: string} $info
     */
    private function buildAttributes(array $info, bool $isAudio): string
    {
        $attrs = [];

        // Title
        if ($this->title) {
            $attrs['title'] = $this->title;
        }

        // Language
        $attrs['lang'] = $this->lang;

        // Aspect ratio
        if ($this->aspectRatio) {
            $attrs['aspect-ratio'] = $this->aspectRatio;
        }

        // Source handling
        if ('local' === $info['platform']) {
            // Local video/audio: set src directly
            $attrs['src'] = $this->getSourceUrl();
        } else {
            // YouTube/Vimeo: set data attributes (consent manager will set src later)
            $attrs['data-video-platform'] = $info['platform'];
            $attrs['data-video-id'] = $info['id'];
        }

        // Crossorigin (always for proper track support)
        $attrs['crossorigin'] = '';

        // Merge custom attributes
        $attrs = array_merge($attrs, $this->attributes);

        // Build string
        return Utilities::buildHtmlAttributes($attrs);
    }

    /**
     * @param array{platform: string, id: string} $info
     */
    private function buildAriaLabel(array $info, bool $isAudio): string
    {
        if ($this->title) {
            return rex_escape($this->title);
        }

        if ('local' !== $info['platform']) {
            return rex_escape(Translator::get('a11y_video_from', $this->lang) . ' ' . ucfirst($info['platform']));
        }

        return rex_escape(Translator::get($isAudio ? 'a11y_audio_player' : 'a11y_video_player', $this->lang));
    }

    private function generateSources(bool $isAudio): string
    {
        if (!empty($this->sources)) {
            // Multiple sources (sorted by quality)
            $sorted = $this->sortSourcesByQuality($this->sources);
            $parts = [];
            foreach ($sorted as $source) {
                $parts[] = $this->generateSourceElement($source);
            }
            return implode('', $parts);
        }

        // Single source
        $type = $isAudio ? 'audio/mp3' : Utilities::detectMimeType($this->source);
        return '<source src="' . rex_escape($this->getSourceUrl()) . "\" type=\"{$type}\" />";
    }

    /**
     * @param array{src: string, type?: string, width?: int, height?: int} $source
     */
    private function generateSourceElement(array $source): string
    {
        $src = $this->getMediaUrl($source['src']);
        $type = $source['type'] ?? Utilities::detectMimeType($source['src']);

        $html = '<source src="' . rex_escape($src) . '" type="' . rex_escape($type) . '"';

        if (isset($source['width'], $source['height'])) {
            $html .= " width=\"{$source['width']}\" height=\"{$source['height']}\"";
        }

        $html .= ' />';

        return $html;
    }

    /**
     * @param array{src: string, kind: string, label: string, srclang: string, default: bool} $track
     */
    private function generateTrack(array $track): string
    {
        $src = $this->getMediaUrl($track['src']);
        $default = $track['default'] ? ' default' : '';

        return '<track src="' . rex_escape($src) . '" kind="' . rex_escape($track['kind']) . '" label="' . rex_escape($track['label']) . '" srclang="' . rex_escape($track['srclang']) . "\"{$default} />";
    }

    private function generateVideoLayout(): string
    {
        $attrs = '';

        if ($this->thumbnails) {
            $attrs .= ' thumbnails="' . rex_escape($this->thumbnails) . '"';
        }

        return "<media-video-layout{$attrs}></media-video-layout>";
    }

    /**
     * @param array<int, array{src: string, type?: string, width?: int, height?: int}> $sources
     * @return array<int, array{src: string, type?: string, width?: int, height?: int}>
     */
    private function sortSourcesByQuality(array $sources): array
    {
        usort($sources, static function (array $a, array $b): int {
            $aWidth = (int) ($a['width'] ?? 0);
            $bWidth = (int) ($b['width'] ?? 0);

            if ($aWidth !== $bWidth) {
                return $bWidth <=> $aWidth; // Highest first
            }

            $aHeight = (int) ($a['height'] ?? 0);
            $bHeight = (int) ($b['height'] ?? 0);
            return $bHeight <=> $aHeight;
        });

        return $sources;
    }

    // ==========================================
    // HELPERS
    // ==========================================

    /**
     * @return array{platform: string, id: string}
     */
    private function getPlatformInfo(): array
    {
        if (null === $this->platformInfo) {
            $this->platformInfo = PlatformDetector::detect($this->source);
        }
        return $this->platformInfo;
    }

    private function getSourceUrl(): string
    {
        return $this->getMediaUrl($this->source);
    }

    private function getMediaUrl(string $path): string
    {
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }
        return rex_url::media($path);
    }
}
