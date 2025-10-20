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
if (rex::isBackend()) {
    // Load backend assets on all backend pages
    rex_view::addCssFile($addon->getAssetsUrl('vidstack-backend.min.css'));
    rex_view::addJsFile($addon->getAssetsUrl('vidstack-backend.min.js'));

    // Mediapool sidebar
    rex_extension::register('MEDIA_DETAIL_SIDEBAR', static function (rex_extension_point $ep) {
        return BackendIntegration::renderMediapoolSidebar($ep);
    });
}
