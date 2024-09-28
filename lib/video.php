<?php

namespace FriendsOfRedaxo\VidStack;

use rex_escape;
use rex_path;
use rex_url;

class Video
{
    private readonly string $source;
    private string $title;
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
        $this->attributes = $attributes;
    }

    public function setA11yContent(string $description, string $alternativeUrl = ''): void
    {
        $alternativeUrl = $alternativeUrl ?: $this->getAlternativeUrl();

        $this->a11yContent = "<div class=\"video-description\">"
            . "<p>" . rex_escape($this->getText('video_description')) . ": " . rex_escape($description) . "</p></div>"
            . "<div class=\"alternative-links\">"
            . "<p>" . rex_escape($this->getText('video_alternative_view')) . ": <a href=\"" . rex_escape($alternativeUrl) . "\">"
            . rex_escape($this->getText('video_open_alternative_view')) . "</a></p>"
            . "</div>";
    }

    public function setThumbnails(string $thumbnailsUrl): void
    {
        $this->thumbnails = $thumbnailsUrl;
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

    private function getVideoInfo(): array
    {
        $youtubePattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=|shorts/)|youtu\.be/)([^"&?/ ]{11})%i';
        if (preg_match($youtubePattern, $this->source, $match)) {
            return ['platform' => 'youtube', 'id' => $match[1]];
        }
        $vimeoPattern = '~(?:<iframe [^>]*src=")?(?:https?:\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w]*\/(progressive_redirect\/playback|external|videos?))?\/([0-9]+)[^\s]*)"?(?:[^>]*></iframe>)?(?:<p>.*</p>)?~ix';
        if (preg_match($vimeoPattern, $this->source, $match)) {
            return ['platform' => 'vimeo', 'id' => $match[2]];
        }
        return ['platform' => 'default', 'id' => ''];
    }

    public function generateFull(): string
    {
        $videoInfo = $this->getVideoInfo();
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"" . rex_escape($this->title) . "\"" : '';

        $code = "<div class=\"video-container\" role=\"region\" aria-label=\"" . rex_escape($this->getText('a11y_video_player')) . "\">";

        if ($videoInfo['platform'] !== 'default') {
            $consentTextKey = "consent_text_{$videoInfo['platform']}";
            $consentText = $this->getText($consentTextKey);
            if ($consentText === "[[{$consentTextKey}]]") {
                $consentText = $this->getText('consent_text_default');
            }

            $code .= $this->generateConsentPlaceholder($consentText, $videoInfo['platform'], $videoInfo['id']);
        }

        $code .= "<media-player{$titleAttr}{$attributesString}";

        if ($videoInfo['platform'] !== 'default') {
            $code .= " data-video-platform=\"" . rex_escape($videoInfo['platform']) . "\" data-video-id=\"" . rex_escape($videoInfo['id']) . "\""
                . " aria-label=\"" . rex_escape($this->getText('a11y_video_from')) . " " . rex_escape($videoInfo['platform']) . "\"";
        } else {
            $code .= " src=\"" . rex_escape($this->getSourceUrl()) . "\"";
        }

        $code .= " role=\"application\"" . ($videoInfo['platform'] !== 'default' ? " style=\"display:none;\"" : "") . ">";
        $code .= "<media-provider></media-provider>";
        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"" . rex_escape($subtitle['src']) . "\" kind=\"" . rex_escape($subtitle['kind']) . "\" label=\"" . rex_escape($subtitle['label']) . "\" srclang=\"" . rex_escape($subtitle['lang']) . "\"{$defaultAttr} />";
        }
        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"" . rex_escape($this->thumbnails) . "\"" : "") . "></media-video-layout>";
        $code .= "</media-player>";

        if ($this->a11yContent) {
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
        $code = "<media-player{$titleAttr}{$attributesString} src=\"" . rex_escape($sourceUrl) . "\" role=\"application\" aria-label=\"" . rex_escape($this->getText('a11y_video_player')) . "\">";
        $code .= "<media-provider></media-provider>";
        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"" . rex_escape($subtitle['src']) . "\" kind=\"" . rex_escape($subtitle['kind']) . "\" label=\"" . rex_escape($subtitle['label']) . "\" srclang=\"" . rex_escape($subtitle['lang']) . "\"{$defaultAttr} />";
        }
        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"" . rex_escape($this->thumbnails) . "\"" : "") . "></media-video-layout>";
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
}
