(function() {
    function initVideoConsent() {
        // Prüfen, ob mindestens ein .video-container Element existiert
        if (!document.querySelector('.video-container')) {
            console.log('No .video-container elements found. Exiting initVideoConsent.');
            return;
        }

        const translations = {
            de: {
                'Seek forward {amount} seconds': '{amount} Sekunden vorwärts springen',
                'Seek backward {amount} seconds': '{amount} Sekunden rückwärts springen',
                'Seek to live': 'Zur Live-Übertragung springen',
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
                'Accessibility': 'Barrierefreiheit',
                'AirPlay': 'AirPlay',
                'Announcements': 'Ankündigungen',
                'Audio': 'Audio',
                'Auto': 'Auto',
                'Boost': 'Verstärken',
                'Captions': 'Untertitel',
                'Chapters': 'Kapitel',
                'Color': 'Farbe',
                'Connected': 'Verbunden',
                'Connecting': 'Verbindung wird hergestellt',
                'Continue': 'Fortsetzen',
                'Default': 'Standard',
                'Disabled': 'Deaktiviert',
                'Disconnected': 'Getrennt',
                'Download': 'Herunterladen',
                'Family': 'Familie',
                'Font': 'Schriftart',
                'Fullscreen': 'Vollbild',
                'LIVE': 'LIVE',
                'Loop': 'Wiederholen',
                'Mute': 'Stummschalten',
                'Normal': 'Normal',
                'Off': 'Aus',
                'Opacity': 'Deckkraft',
                'Pause': 'Pause',
                'PiP': 'Bild-in-Bild',
                'Play': 'Abspielen',
                'Playback': 'Wiedergabe',
                'Quality': 'Qualität',
                'Replay': 'Wiederholen',
                'Reset': 'Zurücksetzen',
                'Seek': 'Suchen',
                'Settings': 'Einstellungen',
                'Shadow': 'Schatten',
                'Size': 'Größe',
                'Speed': 'Geschwindigkeit',
                'Text': 'Text',
                'Track': 'Spur',
                'Unmute': 'Ton einschalten',
                'Volume': 'Lautstärke',
            },
            en: {
                'Seek forward {amount} seconds': 'Seek forward {amount} seconds',
                'Seek backward {amount} seconds': 'Seek backward {amount} seconds',
                'Seek to live': 'Seek to live',
                'Caption Styles': 'Caption Styles',
                'Captions look like this': 'Captions look like this',
                'Closed-Captions Off': 'Closed-Captions Off',
                'Closed-Captions On': 'Closed-Captions On',
                'Display Background': 'Display Background',
                'Enter Fullscreen': 'Enter Fullscreen',
                'Enter PiP': 'Enter PiP',
                'Exit Fullscreen': 'Exit Fullscreen',
                'Exit PiP': 'Exit PiP',
                'Google Cast': 'Google Cast',
                'Keyboard Animations': 'Keyboard Animations',
                'Seek Backward': 'Seek Backward',
                'Seek Forward': 'Seek Forward',
                'Skip To Live': 'Skip To Live',
                'Text Background': 'Text Background',
                'Accessibility': 'Accessibility',
                'AirPlay': 'AirPlay',
                'Announcements': 'Announcements',
                'Audio': 'Audio',
                'Auto': 'Auto',
                'Boost': 'Boost',
                'Captions': 'Captions',
                'Chapters': 'Chapters',
                'Color': 'Color',
                'Connected': 'Connected',
                'Connecting': 'Connecting',
                'Continue': 'Continue',
                'Default': 'Default',
                'Disabled': 'Disabled',
                'Disconnected': 'Disconnected',
                'Download': 'Download',
                'Family': 'Family',
                'Font': 'Font',
                'Fullscreen': 'Fullscreen',
                'LIVE': 'LIVE',
                'Loop': 'Loop',
                'Mute': 'Mute',
                'Normal': 'Normal',
                'Off': 'Off',
                'Opacity': 'Opacity',
                'Pause': 'Pause',
                'PiP': 'PiP',
                'Play': 'Play',
                'Playback': 'Playback',
                'Quality': 'Quality',
                'Replay': 'Replay',
                'Reset': 'Reset',
                'Seek': 'Seek',
                'Settings': 'Settings',
                'Shadow': 'Shadow',
                'Size': 'Size',
                'Speed': 'Speed',
                'Text': 'Text',
                'Track': 'Track',
                'Unmute': 'Unmute',
                'Volume': 'Volume',
            }
        };

        function getPlayerLanguage(player) {
            return player.getAttribute('lang') || 'en';
        }

        function applyTranslations(player) {
            const videoLayout = player.querySelector('media-video-layout');
            if (videoLayout) {
                const lang = getPlayerLanguage(player);
                videoLayout.translations = translations[lang] || translations['en'];
            }
        }

        function loadVideo(originalPlayer, placeholderId) {
            console.log(`Attempting to load video for placeholder: ${placeholderId}`);
            const placeholder = document.getElementById(placeholderId);
            if (!placeholder) {
                console.error(`Placeholder with id ${placeholderId} not found`);
                return;
            }
            const wrapper = placeholder.parentElement;
            if (!wrapper) {
                console.error(`Parent element for placeholder ${placeholderId} not found`);
                return;
            }
            
            const mediaPlayer = originalPlayer.cloneNode(true);
            
            const consentSource = mediaPlayer.getAttribute('data-consent-source');
            if (!consentSource) {
                console.error(`data-consent-source attribute not found on player: ${mediaPlayer.id}`);
                return;
            }
            mediaPlayer.setAttribute('src', consentSource);
            
            mediaPlayer.removeAttribute('data-consent-source');
            mediaPlayer.removeAttribute('data-consent-text');

            wrapper.replaceChild(mediaPlayer, placeholder);

            applyTranslations(mediaPlayer);
            console.log(`Video loaded successfully for placeholder: ${placeholderId}`);
        }

        function createConsentPlaceholder(videoContainer, originalPlayer, consentText) {
            if (!videoContainer) {
                console.error('Video container not found');
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            
            const placeholder = document.createElement('div');
            placeholder.className = 'consent-placeholder';
            const placeholderId = 'consent-placeholder-' + Math.random().toString(36).substr(2, 9);
            placeholder.id = placeholderId;

            const text = document.createElement('p');
            text.textContent = consentText;

            const button = document.createElement('button');
            const lang = getPlayerLanguage(originalPlayer);
            button.textContent = lang === 'de' ? 'Video laden' : 'Load Video';
            button.addEventListener('click', () => loadVideo(originalPlayer, placeholderId));

            placeholder.appendChild(text);
            placeholder.appendChild(button);
            wrapper.appendChild(placeholder);

            videoContainer.replaceChild(wrapper, originalPlayer);
            console.log(`Consent placeholder created for player: ${originalPlayer.id}`);
        }

        function handleVideoConsent() {
            console.log('Handling video consent');
            document.querySelectorAll('media-player').forEach(applyTranslations);

            document.querySelectorAll('media-player[data-consent-source]').forEach(player => {
                console.log(`Processing player: ${player.id}`);
                const videoContainer = player.closest('.video-container');
                if (!videoContainer) {
                    console.error('Video container not found for player:', player);
                    return;
                }

                const consentSource = player.getAttribute('data-consent-source');
                const lang = getPlayerLanguage(player);
                const defaultConsentText = lang === 'de' 
                    ? 'Klicken Sie hier, um das Video zu laden und abzuspielen.' 
                    : 'Click here to load and play the video.';
                const consentText = player.getAttribute('data-consent-text') || defaultConsentText;
                
                if (consentSource.startsWith('youtube/')) {
                    if (window.vidstack_consent_youtube === true) {
                        loadVideo(player, player.id);
                    } else {
                        createConsentPlaceholder(videoContainer, player, consentText);
                    }
                } else if (consentSource.startsWith('vimeo/')) {
                    if (window.vidstack_consent_vimeo === true) {
                        loadVideo(player, player.id);
                    } else {
                        createConsentPlaceholder(videoContainer, player, consentText);
                    }
                }
            });

            document.documentElement.className = 'js';
            console.log('Video consent handling completed');
        }

        // Execute the script immediately
        handleVideoConsent();

        // Set up listeners for future consent changes
        window.addEventListener('vidstack_consent_changed', handleVideoConsent);
        console.log('Event listener for vidstack_consent_changed set up');
    }

    // Execute on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoConsent);
        console.log('initVideoConsent scheduled for DOMContentLoaded');
    } else {
        initVideoConsent();
        console.log('initVideoConsent executed immediately');
    }

    // Execute on jQuery's ready event if available
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('rex:ready', initVideoConsent);
        console.log('initVideoConsent scheduled for rex:ready event');
    }

    // Execute on a custom 'videoready' event
    document.addEventListener('videoready', initVideoConsent);
    console.log('Event listener for videoready set up');
})();
