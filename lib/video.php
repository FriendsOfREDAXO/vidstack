<?php
namespace FriendsOfRedaxo\VidStack;

class Video {
    private readonly string $source;
    private string $title;
    private array $attributes = [];
    private string $a11yContent = '';
    private string $thumbnails = '';
    private array $subtitles = [];
    private string $lang;
    private static array $translations = [];
    private static string $translationsFile = rex_path::addon('vidstack', 'lang/translations.php');

    public function __construct(string $source, string $title = '', string $lang = 'de') {
        $this->source = $source;
        $this->title = $title;
        $this->lang = $lang;
        $this->loadTranslations();
    }

    public static function setTranslationsFile(string $file): void {
        self::$translationsFile = $file;
        self::$translations = []; // Reset translations to force reload
    }

    private function loadTranslations(): void {
        if (empty(self::$translations)) {
            $file = self::$translationsFile;
            if (file_exists($file)) {
                self::$translations = include $file;
            } else {
                throw new \RuntimeException("Translations file not found: $file");
            }
        }
    }

    private function getText(string $key): string {
        return self::$translations[$this->lang][$key] ?? "[[{$key}]]";
    }

    public function setAttributes(array $attributes): void {
        $this->attributes = $attributes;
    }

    public function setA11yContent(string $description, string $alternativeUrl = ''): void {
        $alternativeUrl = $alternativeUrl ?: $this->getAlternativeUrl();
        
        $this->a11yContent = "<div class=\"video-description\">"
            . "<p>" . $this->getText('video_description') . ": {$description}</p></div>"
            . "<div class=\"alternative-links\">"
            . "<p>" . $this->getText('video_alternative_view') . ": <a href=\"{$alternativeUrl}\">" 
            . $this->getText('video_open_alternative_view') . "</a></p>"
            . "</div>";
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

    private function getVideoInfo(): array {
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

    public function generateFull(): string {
        $videoInfo = $this->getVideoInfo();
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"{$this->title}\"" : '';
        $code = "<div class=\"video-container\" role=\"region\" aria-label=\"" . $this->getText('a11y_video_player') . "\">"
              . "<media-player{$titleAttr}{$attributesString}";
        
        if ($videoInfo['platform'] !== 'default') {
            $consentTextKey = "consent_text_{$videoInfo['platform']}";
            $consentText = $this->getText($consentTextKey);
            if ($consentText === "[[{$consentTextKey}]]") {
                $consentText = $this->getText('consent_text_default');
            }
            $code .= " data-consent-source=\"{$videoInfo['platform']}/{$videoInfo['id']}\""
                  . " data-consent-text=\"{$consentText}\""
                  . " aria-label=\"" . $this->getText('a11y_video_from') . " {$videoInfo['platform']}\"";
        } else {
            $code .= " src=\"{$this->source}\"";
        }
        $code .= " role=\"application\"";
        $code .= "><media-provider></media-provider>";
        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"{$subtitle['src']}\" kind=\"{$subtitle['kind']}\" label=\"{$subtitle['label']}\" srclang=\"{$subtitle['lang']}\"{$defaultAttr} />";
        }
        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"{$this->thumbnails}\"" : "") . "></media-video-layout>"
              . "</media-player>";
        
        if ($this->a11yContent) {
            $code .= "<div class=\"a11y-content\" role=\"complementary\" aria-label=\"" . $this->getText('a11y_additional_information') . "\">"
                   . $this->a11yContent
                   . "</div>";
        }
        
        $code .= "</div>";
        return $code;
    }

    public function generate(): string {
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"{$this->title}\"" : '';
        $code = "<media-player{$titleAttr}{$attributesString} src=\"{$this->source}\" role=\"application\" aria-label=\"" . $this->getText('a11y_video_player') . "\">";
        $code .= "<media-provider></media-provider>";
        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"{$subtitle['src']}\" kind=\"{$subtitle['kind']}\" label=\"{$subtitle['label']}\" srclang=\"{$subtitle['lang']}\"{$defaultAttr} />";
        }
        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"{$this->thumbnails}\"" : "") . "></media-video-layout>";
        $code .= "</media-player>";
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
