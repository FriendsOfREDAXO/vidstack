<?php

use FriendsOfRedaxo\VidstackPlayer\BackendIntegration;
use FriendsOfRedaxo\VidstackPlayer\OembedParser;
use FriendsOfRedaxo\VidstackPlayer\Translator;

/**
 * This file is part of the vidstack_player package.
 *
 * @author (c) Friends Of REDAXO
 * @author <friendsof@redaxo.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$addon = rex_addon::get('vidstack_player');

// Load translations
Translator::load();

// Backend integration
if (rex::isBackend() && is_object(rex::getUser())) {
    // Mediapool sidebar with lazy asset loading
    rex_extension::register('MEDIA_DETAIL_SIDEBAR', static function (rex_extension_point $ep) {
        // Load assets only when needed
        static $assetsLoaded = false;
        if (!$assetsLoaded) {
            $addon = rex_addon::get('vidstack_player');
            rex_view::addCssFile($addon->getAssetsUrl('vidstack.css'));
            rex_view::addCssFile($addon->getAssetsUrl('vidstack_helper.css'));
            rex_view::addJsFile($addon->getAssetsUrl('vidstack.js'));
            rex_view::addJsFile($addon->getAssetsUrl('vidstack_helper.js'));
            $assetsLoaded = true;
        }
        return BackendIntegration::renderMediapoolSidebar($ep);
    });
}
