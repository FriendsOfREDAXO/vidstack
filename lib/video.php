<?php
namespace FriendsOfRedaxo\VidStack;

use rex_path;

class Video {
    private readonly string $source;
    private string $title;
    private array $attributes = [];
    private string $a11yContent = '';
    private string $thumbnails = '';
    private array $subtitles = [];
    private string $lang;
    private static array $translations = [];

    public function __construct(string $source, string $title = '', string $lang = 'de') {
        $this->source = $source;
        $this->title = $title;
        $this->lang = $lang;
        $this->loadTranslations();
    }

    // ... [previous methods remain unchanged]

    public function generateFull(): string {
        $videoInfo = $this->getVideoInfo();
        $attributesString = $this->generateAttributesString();
        $titleAttr = $this->title ? " title=\"{$this->title}\"" : '';
        
        $code = "<div class=\"video-container\" role=\"region\" aria-label=\"" . $this->getText('a11y_video_player') . "\">";
        
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
            $code .= " data-video-platform=\"{$videoInfo['platform']}\" data-video-id=\"{$videoInfo['id']}\""
                  . " aria-label=\"" . $this->getText('a11y_video_from') . " {$videoInfo['platform']}\"";
        } else {
            $code .= " src=\"{$this->source}\"";
        }
        
        $code .= " role=\"application\"" . ($videoInfo['platform'] !== 'default' ? " style=\"display:none;\"" : "") . ">";
        $code .= "<media-provider></media-provider>";
        foreach ($this->subtitles as $subtitle) {
            $defaultAttr = $subtitle['default'] ? ' default' : '';
            $code .= "<Track src=\"{$subtitle['src']}\" kind=\"{$subtitle['kind']}\" label=\"{$subtitle['label']}\" srclang=\"{$subtitle['lang']}\"{$defaultAttr} />";
        }
        $code .= "<media-video-layout" . ($this->thumbnails ? " thumbnails=\"{$this->thumbnails}\"" : "") . "></media-video-layout>";
        $code .= "</media-player>";
        
        if ($this->a11yContent) {
            $code .= "<div class=\"a11y-content\" role=\"complementary\" aria-label=\"" . $this->getText('a11y_additional_information') . "\">"
                   . $this->a11yContent
                   . "</div>";
        }
        
        $code .= "</div>";
        return $code;
    }

    private function generateConsentPlaceholder(string $consentText, string $platform, string $videoId): string {
        $buttonText = $this->lang === 'de' ? 'Video laden' : 'Load Video';
        return "<div class=\"consent-placeholder\" data-platform=\"{$platform}\" data-video-id=\"{$videoId}\" style=\"aspect-ratio: 16/9;\">"
             . "<p>{$consentText}</p>"
             . "<button type=\"button\" class=\"consent-button\">{$buttonText}</button>"
             . "</div>";
    }

    // ... [other methods remain unchanged]
}
