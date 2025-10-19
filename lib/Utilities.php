<?php

/**
 * Utilities - Helper functions for HTML attributes, MIME types, etc.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use function is_bool;

use const PATHINFO_EXTENSION;

class Utilities
{
    /**
     * Build HTML attributes string from array.
     *
     * @param array<string, mixed> $attributes Associative array of attributes
     * @return string Formatted HTML attributes string with leading space
     */
    public static function buildHtmlAttributes(array $attributes): string
    {
        if (empty($attributes)) {
            return '';
        }

        $parts = [];
        /** @psalm-suppress MixedAssignment */
        foreach ($attributes as $key => $value) {
            if (is_bool($value)) {
                if ($value) {
                    $parts[] = rex_escape($key);
                }
            } else {
                /**
                 * @psalm-suppress MixedOperand
                 * @phpstan-ignore binaryOp.invalidTypes
                 */
                $parts[] = rex_escape($key) . '="' . rex_escape($value) . '"';
            }
        }

        return $parts ? ' ' . implode(' ', $parts) : '';
    }

    /**
     * Detect MIME type from file extension.
     *
     * @param string $source Filename or URL
     * @return string MIME type
     */
    public static function detectMimeType(string $source): string
    {
        $ext = strtolower(pathinfo($source, PATHINFO_EXTENSION));

        return match ($ext) {
            'mp4', 'm4v' => 'video/mp4',
            'webm' => 'video/webm',
            'ogg', 'ogv' => 'video/ogg',
            'mov' => 'video/quicktime',
            'mp3' => 'audio/mp3',
            'wav' => 'audio/wav',
            'aac' => 'audio/aac',
            'm4a' => 'audio/mp4',
            default => 'video/mp4',
        };
    }
}
