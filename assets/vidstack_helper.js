document.addEventListener('DOMContentLoaded', function() {
    // Prüfen, ob mindestens ein .video-container Element existiert
    if (document.querySelector('.video-container')) {
        const germanTranslations = {
            'Caption Styles': 'Untertitelstile',
            'Captions look like this': 'Untertitel sehen so aus',
            'Closed-Captions Off': 'Untertitel aus',
            'Closed-Captions On': 'Untertitel an',
            'Display Background': 'Hintergrund anzeigen',
            'Enter Fullscreen': 'Vollbild',
            'Enter PiP': 'Bild-in-Bild aktivieren',
            'Exit Fullscreen': 'Vollbild beenden',
            'Exit PiP': 'Bild-in-Bild beenden',
            'Google Cast': 'Google Cast',
            'Keyboard Animations': 'Tastatur-Animationen',
            'Seek Backward': 'Zurückspulen',
            'Seek Forward': 'Vorspulen',
            'Skip To Live': 'Zur Live-Übertragung springen',
            'Text Background': 'Texthintergrund',
            Accessibility: 'Barrierefreiheit',
            AirPlay: 'AirPlay',
            Announcements: 'Ankündigungen',
            Audio: 'Audio',
            Auto: 'Auto',
            Boost: 'Verstärken',
            Captions: 'Untertitel',
            Chapters: 'Kapitel',
            Color: 'Farbe',
            Connected: 'Verbunden',
            Connecting: 'Verbindung wird hergestellt',
            Continue: 'Fortsetzen',
            Default: 'Standard',
            Disabled: 'Deaktiviert',
            Disconnected: 'Getrennt',
            Download: 'Herunterladen',
            Family: 'Familie',
            Font: 'Schriftart',
            Fullscreen: 'Vollbild',
            LIVE: 'LIVE',
            Loop: 'Wiederholen',
            Mute: 'Stummschalten',
            Normal: 'Normal',
            Off: 'Aus',
            Opacity: 'Deckkraft',
            Pause: 'Pause',
            PiP: 'Bild-in-Bild',
            Play: 'Abspielen',
            Playback: 'Wiedergabe',
            Quality: 'Qualität',
            Replay: 'Wiederholen',
            Reset: 'Zurücksetzen',
            Seek: 'Suchen',
            Settings: 'Einstellungen',
            Shadow: 'Schatten',
            Size: 'Größe',
            Speed: 'Geschwindigkeit',
            Text: 'Text',
            Track: 'Spur',
            Unmute: 'Ton einschalten',
            Volume: 'Lautstärke',
        };

        function applyTranslations(player) {
            const videoLayout = player.querySelector('media-video-layout');
            if (videoLayout) {
                videoLayout.translations = germanTranslations;
            }
        }

        function loadVideo(originalPlayer, placeholderId) {
            const placeholder = document.getElementById(placeholderId);
            const wrapper = placeholder.parentElement;
            
            const mediaPlayer = originalPlayer.cloneNode(true);
            
            mediaPlayer.setAttribute('src', mediaPlayer.getAttribute('data-consent-source'));
            
            mediaPlayer.removeAttribute('data-consent-source');
            mediaPlayer.removeAttribute('data-consent-text');

            wrapper.replaceChild(mediaPlayer, placeholder);

            applyTranslations(mediaPlayer);
        }

        function createConsentPlaceholder(videoContainer, originalPlayer, consentText) {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            
            const placeholder = document.createElement('div');
            placeholder.className = 'consent-placeholder';
            const placeholderId = 'consent-placeholder-' + Math.random().toString(36).substr(2, 9);
            placeholder.id = placeholderId;

            const text = document.createElement('p');
            text.textContent = consentText;

            const button = document.createElement('button');
            button.textContent = 'Video laden';
            button.addEventListener('click', () => loadVideo(originalPlayer, placeholderId));

            placeholder.appendChild(text);
            placeholder.appendChild(button);
            wrapper.appendChild(placeholder);

            videoContainer.replaceChild(wrapper, originalPlayer);
        }

        document.querySelectorAll('media-player').forEach(applyTranslations);

        document.querySelectorAll('media-player[data-consent-source]').forEach(player => {
            const videoContainer = player.closest('.video-container');
            const consentSource = player.getAttribute('data-consent-source');
            const consentText = player.getAttribute('data-consent-text') || 'Klicken Sie hier, um das Video zu laden und abzuspielen.';
            
            if (consentSource.startsWith('youtube/') || consentSource.startsWith('vimeo/')) {
                createConsentPlaceholder(videoContainer, player, consentText);
            }
        });

        document.documentElement.className = 'js';
    }
});