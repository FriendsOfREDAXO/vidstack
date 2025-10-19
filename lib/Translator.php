<?php

/**
 * Translator - i18n translation helper.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use rex_path;

class Translator
{
    /** @var array<string, array<string, string>> */
    private static array $translations = [];

    /**
     * Load translations from lang file.
     */
    public static function load(): void
    {
        if (empty(self::$translations)) {
            $file = rex_path::addon('vidstack_player', 'lang/translations.php');
            if (file_exists($file)) {
                /** @psalm-suppress MixedAssignment */
                self::$translations = include $file;
            }
        }
    }

    /**
     * Get translated text.
     *
     * @param string $key Translation key
     * @param string $lang Language code (de, en, etc.)
     * @return string Translated text or key if not found
     */
    public static function get(string $key, string $lang = 'de'): string
    {
        self::load();
        return self::$translations[$lang][$key] ?? $key;
    }
}
