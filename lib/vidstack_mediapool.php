<?php
namespace FriendsOfRedaxo\VidStack;

class vidstack_mediapool
{
    public static function show_sidebar(rex_extension_point $ep)
    {
        $params = $ep->getParams();
        $file = $params['filename'];
        
        if (self::checkMedia($file)) {
            return self::outputMedia($file);
        }
    }

    private static function checkMedia($file)
    {
        $file_info = pathinfo($file);
        $ext = $file_info['extension'] ?? '';
        $supported_video = ['mp4', 'webm', 'ogg'];
        $supported_audio = ['mp3', 'wav', 'ogg'];
        
        return in_array(strtolower($ext), array_merge($supported_video, $supported_audio));
    }

    private static function outputMedia($file)
    {
        $video = new FriendsOfRedaxo\VidStack\Video($file);
        $video->setAttributes([
            'playsinline' => true,
            'controls' => true
        ]);

        // Optional: Fügen Sie hier weitere Konfigurationen hinzu, z.B. Untertitel
        // $video->addSubtitle('path/to/subtitle.vtt', 'subtitles', 'Deutsch', 'de', true);

        return $video->generateCode();
    }
}

// Registrieren Sie den Extension Point
rex_extension::register('MEDIA_DETAIL_SIDEBAR', 'vidstack_mediapool::show_sidebar');