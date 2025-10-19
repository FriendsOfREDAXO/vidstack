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

        if (PlatformDetector::isAudio($filename)) {
            return null;
        }

        try {
            /** @phpstan-ignore class.notFound */
            $info = VideoInfo::getInfo($filename);

            if (!$info) {
                return null;
            }

            $parts = [
                '<div class="vidstack-video-info">',
                '<h4>' . rex_i18n::msg('vidstack_video_info_title') . '</h4>',
            ];

            // Resolution
            if ($info['width'] && $info['height']) {
                $resolution = '<div><strong>' . rex_i18n::msg('vidstack_video_info_resolution') . ':</strong> '
                    . rex_escape($info['width']) . ' × ' . rex_escape($info['height']) . ' px';
                if ($info['aspect_ratio']) {
                    $resolution .= ' (' . rex_escape($info['aspect_ratio']) . ')';
                }
                $parts[] = $resolution . '</div>';
            }

            // Codec
            if ($info['video_codec']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_codec') . ':</strong> '
                    . rex_escape(strtoupper($info['video_codec'])) . '</div>';
            }

            // Duration
            if ($info['duration_formatted']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_duration') . ':</strong> '
                    . rex_escape($info['duration_formatted']) . '</div>';
            }

            // Filesize
            if ($info['filesize_formatted']) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_filesize') . ':</strong> '
                    . rex_escape($info['filesize_formatted']) . '</div>';
            }

            // Bitrate
            if (!empty($info['bitrate_formatted']) && $info['bitrate'] > 0) {
                $parts[] = '<div><strong>' . rex_i18n::msg('vidstack_video_info_bitrate') . ':</strong> '
                    . rex_escape($info['bitrate_formatted']) . '</div>';
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
