<?php
/**
 * This file is part of the vidstack package.
 *
 * @author (c) Friends Of REDAXO
 * @author <friendsof@redaxo.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$vs = rex_addon::get('vidstack');
if (rex::isBackend() && is_object(rex::getUser())) {
    rex_view::addCssFile($vs->getAssetsUrl('vidstack.css'));
    rex_view::addCssFile($vs->getAssetsUrl('vidstack_helper.css'));
    rex_view::addJsFile($vs->getAssetsUrl('vidstack.js'));
    rex_view::addJsFile($vs->getAssetsUrl('vidstack_helper.js'));
    rex_extension::register('MEDIA_DETAIL_SIDEBAR', '\FriendsOfRedaxo\VidStack\vidstack_mediapool::show_sidebar');
}
