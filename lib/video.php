<?php

namespace FriendsOfRedaxo\VidStack;

use rex_escape;
use rex_path;
use rex_url;
use rex_media;
use rex_extension;
use rex_extension_point; // Add this import

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

    private function getSourceUrl(): string
    {
        if (filter_var($this->source, FILTER_VALIDATE_URL)) {
            return $this->source;
        }
        return rex_url::media($this->source);
    }

    private function getAlternativeUrl(): string
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

    private static function getVideoInfo(string $source): array
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

        if (!$isAudio && $videoInfo['platform'] !== 'default') {
            $consentTextKey = "consent_text_{$videoInfo['platform']}";
            $consentText = $this->getText($consentTextKey);
            if ($consentText === "[[{$consentTextKey}]]") {
                $consentText = $this->getText('consent_text_default');
            }

            $code .= $this->generateConsentPlaceholder($consentText, $videoInfo['platform'], $videoInfo['id']);
        }

        $code .= $this->generate();

        if (!$isAudio && $this->a11yContent) {
            $code .= "<div class=\"a11y-content\" role=\"complementary\" aria-label=\"" . rex_escape($this->getText('a11y_additional_information')) . "\">"
                . $this->a11yContent
                . "</div>";
        }

        $code .= "</div>";
        return $code;
    }

    public function generate(): string
    {
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"" . rex_escape($this->title) . "\"" : '';
        $sourceUrl = $this->getSourceUrl();
        $isAudio = self::isAudio($this->source);
        $mediaType = $isAudio ? 'audio' : 'video';
        $videoInfo = self::getVideoInfo($this->source);

        $code = "<media-player{$titleAttr}{$attributesString}";

        if (!$isAudio && $videoInfo['platform'] !== 'default') {
            $code .= " data-video-platform=\"" . rex_escape($videoInfo['platform']) . "\" data-video-id=\"" . rex_escape($videoInfo['id']) . "\""
                . " aria-label=\"" . rex_escape($this->getText('a11y_video_from')) . " " . rex_escape($videoInfo['platform']) . "\"";
        } else {
            $code .= " src=\"" . rex_escape($sourceUrl) . "\"";
        }

        $code .= " crossorigin>";

        $code .= "<media-provider>";

        if (!$isAudio && !empty($this->poster)) {
            $code .= "<media-poster class=\"vds-poster\" src=\"" . rex_escape($this->poster['src']) . "\" alt=\"" . rex_escape($this->poster['alt']) . "\"></media-poster>";
        }

        if ($videoInfo['platform'] === 'default') {
            $code .= "<source src=\"" . rex_escape($sourceUrl) . "\" type=\"" . ($isAudio ? "audio/mp3" : "video/mp4") . "\" />";
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

    private function generateAttributesString(): string
    {
        return array_reduce(array_keys($this->attributes), function ($carry, $key) {
            $value = $this->attributes[$key];
            return $carry . (is_bool($value) ? ($value ? " " . rex_escape($key) : '') : " " . rex_escape($key) . "=\"" . rex_escape($value) . "\"");
        }, '');
    }

    private function generateConsentPlaceholder(string $consentText, string $platform, string $videoId): string
    {
        $buttonText = $this->getText('Load Video');
        return "<div class=\"consent-placeholder\" aria-hidden=\"true\" data-platform=\"" . rex_escape($platform) . "\" data-video-id=\"" . rex_escape($videoId) . "\" style=\"aspect-ratio: 16/9;\">"
            . "<p>" . rex_escape($consentText) . "</p>"
            . "<button type=\"button\" class=\"consent-button\">" . rex_escape($buttonText) . "</button>"
            . "</div>";
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
            $video->setAttributes([
                'crossorigin' => '',
                'playsinline' => true,
                'controls' => true
            ]);
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

            return $existingContent . $newContent;
        }

        return $existingContent;
    }
}
