<?php

/**
 * Asset Helper - CSS and JavaScript loading with cache-busting.
 *
 * @package redaxo\vidstack_player
 * @author Friends Of REDAXO
 */

namespace FriendsOfRedaxo\VidstackPlayer;

use rex_path;
use rex_url;

use const PHP_EOL;

class AssetHelper
{
    private const ADDON_NAME = 'vidstack_player';
    private const CSS_FILES = ['vidstack.min.css'];
    private const JS_FILES = ['vidstack.min.js'];

    /**
     * Get all CSS tags for frontend integration.
     *
     * @param array<string, mixed> $attributes Additional HTML attributes for link tags (e.g., ['media' => 'print'])
     * @param bool $cachebuster Add cache-busting query parameter based on file modification time
     * @return string HTML link tags for Vidstack CSS files
     */
    public static function getCss(array $attributes = [], bool $cachebuster = true): string
    {
        return self::buildAssetTags('css', self::CSS_FILES, $attributes, $cachebuster);
    }

    /**
     * Get all JavaScript tags for frontend integration.
     *
     * @param bool $defer Add defer attribute (recommended for better performance)
     * @param bool $async Add async attribute (use with caution, may cause race conditions)
     * @param array<string, mixed> $attributes Additional HTML attributes for script tags (e.g., ['type' => 'module'])
     * @param bool $cachebuster Add cache-busting query parameter based on file modification time
     * @return string HTML script tags for Vidstack JS files
     */
    public static function getJs(bool $defer = false, bool $async = false, array $attributes = [], bool $cachebuster = true): string
    {
        $scriptAttrs = $attributes;

        if ($defer) {
            $scriptAttrs['defer'] = true;
        }

        if ($async) {
            $scriptAttrs['async'] = true;
        }

        return self::buildAssetTags('js', self::JS_FILES, $scriptAttrs, $cachebuster);
    }

    /**
     * Build asset tags (internal helper method).
     *
     * @param string $type Asset type ('css' or 'js')
     * @param array<string> $files Array of filenames
     * @param array<string, mixed> $attributes HTML attributes
     * @param bool $cachebuster Enable cache-busting
     * @return string HTML tags
     */
    private static function buildAssetTags(string $type, array $files, array $attributes, bool $cachebuster): string
    {
        $attrString = Utilities::buildHtmlAttributes($attributes);
        $tags = [];

        foreach ($files as $file) {
            $url = rex_url::addonAssets(self::ADDON_NAME, $file);

            if ($cachebuster) {
                $url = self::addCachebuster($url, $file);
            }

            $tags[] = 'css' === $type
                ? '<link rel="stylesheet" href="' . $url . '"' . $attrString . '>'
                : '<script src="' . $url . '"' . $attrString . '></script>';
        }

        return implode(PHP_EOL, $tags);
    }

    /**
     * Add cachebuster query parameter based on file modification time.
     *
     * @param string $url The asset URL
     * @param string $filename The filename in the assets folder
     * @return string URL with cachebuster parameter
     */
    private static function addCachebuster(string $url, string $filename): string
    {
        $filePath = rex_path::addonAssets(self::ADDON_NAME, $filename);

        if (file_exists($filePath)) {
            $mtime = filemtime($filePath);
            if (false === $mtime) {
                return $url;
            }
            $separator = str_contains($url, '?') ? '&' : '?';
            return $url . $separator . 'v=' . $mtime;
        }

        return $url;
    }
}
