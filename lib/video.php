<?php

namespace FriendsOfRedaxo\VidStack;

class Video {
    private readonly string $source;
    private string $title;
    private array $attributes = [];
    private string $a11yContent = '';
    private string $thumbnails = '';
    private array $subtitles = [];

    public function __construct(string $source, string $title = '') {
        $this->source = $source;
        $this->title = $title;
    }

    public function setAttributes(array $attributes): void {
        $this->attributes = $attributes;
    }

    public function setA11yContent(string $description, string $alternativeUrl = ''): void {
        $alternativeUrl = $alternativeUrl ?: $this->getAlternativeUrl();
        
        $this->a11yContent = "<div class=\"a11y-content\">"
            . "<div class=\"video-description\">"
            . "<p>Beschreibung: {$description}</p></div>"
            . "<div class=\"alternative-links\">"
            . "<p>Alternative Ansicht: <a href=\"{$alternativeUrl}\">Video in alternativer Ansicht öffnen</a></p>"
            . "</div></div>";
    }

    public function setThumbnails(string $thumbnailsUrl): void {
        $this->thumbnails = $thumbnailsUrl;
    }

    public function addSubtitle(string $src, string $kind, string $label, string $lang, bool $default = false): void {
        $this->subtitles[] = [
            'src' => $src,
            'kind' => $kind,
            'label' => $label,
            'lang' => $lang,
            'default' => $default
        ];
    }

    private function getAlternativeUrl(): string {
        return filter_var($this->source, FILTER_VALIDATE_URL) 
            ? $this->source 
            : "/media/" . basename($this->source);
    }

    private function getVideoId(): string {
        // YouTube ID Erkennung mit preg_match
        $youtubePattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=|shorts/)|youtu\.be/)([^"&?/ ]{11})%i';
        if (preg_match($youtubePattern, $this->source, $match)) {
            return "youtube/{$match[1]}";
        }

        // Vimeo ID Erkennung mit preg_match
        $vimeoPattern = '~(?:<iframe [^>]*src=")?(?:https?:\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w]*\/(progressive_redirect\/playback|external|videos?))?\/([0-9]+)[^\s]*)"?(?:[^>]*></iframe>)?(?:<p>.*</p>)?~ix';
        if (preg_match($vimeoPattern, $this->source, $match)) {
            return "vimeo/{$match[2]}";
        }

        return ''; // Kein Video erkannt
    }

    public function generateCode(): string {
        $videoId = $this->getVideoId();
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"{$this->title}\"" : '';

        $code = "<div class=\"video-container\">"
              . "<media-player{$titleAttr}{$attributesString}";
        
        if ($videoId) {
            $code .= " data-consent-source=\"{$videoId}\""
                  . " data-consent-text=\"Klicken Sie hier, um das Video zu laden und abzuspielen.\"";
        } else {
            $code .= " src=\"{$this->source}\"";
        }

        $code .= "><media-provider></media-provider>";

        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"{$subtitle['src']}\" kind=\"{$subtitle['kind']}\" label=\"{$subtitle['label']}\" srclang=\"{$subtitle['lang']}\"{$defaultAttr} />";
        }

        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"{$this->thumbnails}\"" : "") . "></media-video-layout>"
              . "</media-player>"
              . $this->a11yContent
              . "</div>";

        return $code;
    }

    private function generateAttributesString(): string {
        return array_reduce(array_keys($this->attributes), function($carry, $key) {
            $value = $this->attributes[$key];
            return $carry . (is_bool($value) ? ($value ? " {$key}" : '') : " {$key}=\"{$value}\"");
        }, '');
    }
}
?>