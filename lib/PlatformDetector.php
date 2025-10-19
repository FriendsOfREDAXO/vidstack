<?php

/**
 * Platform Detector - Detects video platform (YouTube, Vimeo, Local) and media types.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use rex_media;

use function in_array;
use function is_string;

use const FILTER_VALIDATE_URL;
use const PATHINFO_EXTENSION;
use const PHP_URL_PATH;

class PlatformDetector
{
    /**
     * Detect platform from source URL.
     *
     * @param string $source URL or filename
     * @return array{platform: string, id: string}
     */
    public static function detect(string $source): array
    {
        // YouTube
        $ytPattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=|shorts/)|youtu\.be/)([^"&?/ ]{11})%i';
        if (preg_match($ytPattern, $source, $match)) {
            return ['platform' => 'youtube', 'id' => $match[1]];
        }

        // Vimeo
        $vimeoPattern = '~(?:https?://)?(?:www\.)?vimeo\.com/(?:channels/(?:\w+/)?|groups/[^/]*/videos/|album/\d+/video/|video/|)(\d+)~i';
        if (preg_match($vimeoPattern, $source, $match)) {
            return ['platform' => 'vimeo', 'id' => $match[1]];
        }

        return ['platform' => 'local', 'id' => ''];
    }

    /**
     * Check if source is an audio file.
     *
     * @param string $source URL or filename
     */
    public static function isAudio(string $source): bool
    {
        $audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];

        if (filter_var($source, FILTER_VALIDATE_URL)) {
            $path = parse_url($source, PHP_URL_PATH);
            if (!is_string($path)) {
                return false;
            }
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        } else {
            $media = rex_media::get($source);
            if (!$media) {
                return false;
            }
            $ext = strtolower(pathinfo($media->getFileName(), PATHINFO_EXTENSION));
        }

        return in_array($ext, $audioExts);
    }

    /**
     * Check if source is a valid media file (video or audio).
     *
     * @param string $source URL or filename
     */
    public static function isMedia(string $source): bool
    {
        $mediaExts = ['mp4', 'mov', 'm4v', 'ogg', 'webm', 'mp3', 'wav', 'aac', 'm4a'];

        if (filter_var($source, FILTER_VALIDATE_URL)) {
            $path = parse_url($source, PHP_URL_PATH);
            if (!is_string($path)) {
                return false;
            }
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        } else {
            $media = rex_media::get($source);
            if (!$media) {
                return false;
            }
            $ext = strtolower(pathinfo($media->getFileName(), PATHINFO_EXTENSION));
        }

        return in_array($ext, $mediaExts);
    }
}
