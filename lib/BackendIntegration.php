<?php

/**
 * Backend Integration - Mediapool sidebar and FFmpeg integration.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use Exception;
use FriendsOfRedaxo\FFmpeg\VideoInfo;
use rex_addon;
use rex_extension_point;
use rex_i18n;
use rex_url;

use function is_string;

class BackendIntegration
{
    /**
     * Render mediapool sidebar with player and video info.
     *
     * @param rex_extension_point<string> $ep
     */
    public static function renderMediapoolSidebar(rex_extension_point $ep): ?string
    {
        $params = $ep->getParams();
        $filename = $params['filename'];
        $existing = $ep->getSubject();

        if (!is_string($filename) || !PlatformDetector::isMedia($filename)) {
            return $existing;
        }

        $player = (new VidstackPlayer($filename))
            ->attributes(['controls' => true, 'playsinline' => true]);

        $html = $player->render();

        // Add FFmpeg info if available
        $ffmpegInfo = self::renderFFmpegInfo($filename);
        if ($ffmpegInfo) {
            $html .= $ffmpegInfo;
        }

        return $existing . $html;
    }

    /**
     * Render FFmpeg video information.
     *
     * @psalm-suppress UndefinedClass
     * @psalm-suppress MixedAssignment
     * @psalm-suppress MixedArrayAccess
     * @psalm-suppress MixedOperand
     * @psalm-suppress MixedArgument
     */
    private static function renderFFmpegInfo(string $filename): ?string
    {
        $ffmpegAddon = rex_addon::get('ffmpeg');
        if (!$ffmpegAddon->isAvailable()) {
            return null;
        }

        // Check if FFmpeg VideoInfo class exists
        if (!class_exists('\FriendsOfRedaxo\FFmpeg\VideoInfo')) {
            return null;
        }

        if (PlatformDetector::isAudio($filename)) {
            return null;
        }

        try {
            $videoInfo = \FriendsOfRedaxo\FFmpeg\VideoInfo::getBasicInfo($filename);

            if (!$videoInfo) {
                return null;
            }

            $parts = [
                '<div class="vidstack-video-info">',
                '<h4>' . rex_i18n::msg('vidstack_video_info_title') . '</h4>',
            ];

            // Resolution
            if ($videoInfo['width'] && $videoInfo['height']) {
                $resolution = '<div><strong>' . rex_i18n::msg('vidstack_video_info_resolution') . ':</strong> '
                    . rex_escape($videoInfo['width']) . ' × ' . rex_escape($videoInfo['height']) . ' px';
                if ($videoInfo['aspect_ratio']) {
                    $resolution .= ' (' . rex_escape($videoInfo['aspect_ratio']) . ')';
                }
                $parts[] = $resolution . '</div>';
            }

            // Codec
            if ($videoInfo['video_codec']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_codec') . ':</strong> '
                    . rex_escape(strtoupper($videoInfo['video_codec'])) . '</div>';
            }

            // Duration
            if ($videoInfo['duration_formatted']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_duration') . ':</strong> '
                    . rex_escape($videoInfo['duration_formatted']) . '</div>';
            }

            // Filesize
            if ($videoInfo['filesize_formatted']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_filesize') . ':</strong> '
                    . rex_escape($videoInfo['filesize_formatted']) . '</div>';
            }

            // Bitrate
            if (!empty($videoInfo['bitrate_formatted']) && $videoInfo['bitrate'] > 0) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_bitrate') . ':</strong> '
                    . rex_escape($videoInfo['bitrate_formatted']) . '</div>';
            }

            // Action buttons
            $parts[] = self::renderFFmpegButtons($filename);
            $parts[] = '</div>';

            return implode('', $parts);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Render FFmpeg action buttons.
     */
    private static function renderFFmpegButtons(string $filename): string
    {
        // Pre-generate URLs
        $trimUrl = rex_escape(rex_url::backendPage('mediapool/ffmpeg/trimmer', ['video' => $filename]));
        $optUrl = rex_escape(rex_url::backendPage('mediapool/ffmpeg', ['video' => $filename]));
        $infoUrl = rex_escape(rex_url::backendPage('mediapool/ffmpeg/info', ['video' => $filename]));

        return '<div class="vidstack-action-buttons">'
            . '<div class="vidstack-action-buttons-label"><strong>' . rex_i18n::msg('vidstack_video_tools') . ':</strong></div>'
            . '<div class="vidstack-action-buttons-group">'
            . '<a href="' . $trimUrl . '" class="btn btn-xs btn-primary vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_trim_title') . '">'
            . '<i class="rex-icon fa-cut"></i> ' . rex_i18n::msg('vidstack_tool_trim') . '</a>'
            . '<a href="' . $optUrl . '" class="btn btn-xs btn-success vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_optimize_title') . '">'
            . '<i class="rex-icon fa-compress"></i> ' . rex_i18n::msg('vidstack_tool_optimize') . '</a>'
            . '<a href="' . $infoUrl . '" class="btn btn-xs btn-info vidstack-tool-btn" title="' . rex_i18n::msg('vidstack_tool_details_title') . '">'
            . '<i class="rex-icon fa-info-circle"></i> ' . rex_i18n::msg('vidstack_tool_details') . '</a>'
            . '</div></div>';
    }
}
