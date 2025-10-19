<?php

/**
 * oEmbed Parser - CKE5 Integration for automatic video replacement.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use rex_extension;
use rex_extension_point;

use function is_string;

class OembedParser
{
    /**
     * Register oEmbed parser extension.
     */
    public static function register(): void
    {
        rex_extension::register('OUTPUT_FILTER', static function (rex_extension_point $ep) {
            $content = $ep->getSubject();
            if (!is_string($content)) {
                return $content;
            }
            return self::parse($content);
        }, rex_extension::LATE);
    }

    /**
     * Parse oEmbed tags and replace with Vidstack player.
     *
     * @param string $content HTML content
     */
    public static function parse(string $content): string
    {
        $result = preg_replace_callback('/<oembed url="(.+?)"><\/oembed>/is', static function ($match) {
            $player = (new VidstackPlayer($match[1]))
                ->attributes(['playsinline' => true]);
            return $player->render();
        }, $content);

        return is_string($result) ? $result : $content;
    }
}
