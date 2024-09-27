document.addEventListener('DOMContentLoaded', function() {
    const consentKey = 'video_consent';
    let videoConsent = JSON.parse(localStorage.getItem(consentKey) || '{}');

    const translations = {
        de: {
            'Load Video': 'Video laden',
            'Consent given': 'Zustimmung erteilt',
            'Click here to load and play the video.': 'Klicken Sie hier, um das Video zu laden und abzuspielen.',
            'Video from': 'Video von',
            'Video description': 'Videobeschreibung',
            'Alternative view': 'Alternative Ansicht',
            'Open alternative view': 'Alternative Ansicht öffnen',
            'Additional information': 'Zusätzliche Informationen',
            'Video player': 'Videoplayer',
            'Seek forward {amount} seconds': '{amount} Sekunden vorwärts springen',
            'Seek backward {amount} seconds': '{amount} Sekunden rückwärts springen',
            'Seek to live': 'Zur Live-Übertragung springen',
            'Caption Styles': 'Untertitelstile',
            'Captions look like this': 'Untertitel sehen so aus',
            'Closed-Captions Off': 'Untertitel aus',
            'Closed-Captions On': 'Untertitel an',
            'Enter Fullscreen': 'Vollbild',
            'Exit Fullscreen': 'Vollbild beenden',
            'Enter PiP': 'Bild-in-Bild aktivieren',
            'Exit PiP': 'Bild-in-Bild beenden',
            'Seek Backward': 'Zurückspulen',
            'Seek Forward': 'Vorspulen',
            'Mute': 'Stummschalten',
            'Unmute': 'Ton einschalten',
            'Play': 'Abspielen',
            'Pause': 'Pause',
            'Settings': 'Einstellungen'
        },
        en: {
            'Load Video': 'Load Video',
            'Consent given': 'Consent given',
            'Click here to load and play the video.': 'Click here to load and play the video.',
            'Video from': 'Video from',
            'Video description': 'Video description',
            'Alternative view': 'Alternative view',
            'Open alternative view': 'Open alternative view',
            'Additional information': 'Additional information',
            'Video player': 'Video player',
            'Seek forward {amount} seconds': 'Seek forward {amount} seconds',
            'Seek backward {amount} seconds': 'Seek backward {amount} seconds',
            'Seek to live': 'Seek to live',
            'Caption Styles': 'Caption Styles',
            'Captions look like this': 'Captions look like this',
            'Closed-Captions Off': 'Closed-Captions Off',
            'Closed-Captions On': 'Closed-Captions On',
            'Enter Fullscreen': 'Enter Fullscreen',
            'Exit Fullscreen': 'Exit Fullscreen',
            'Enter PiP': 'Enter PiP',
            'Exit PiP': 'Exit PiP',
            'Seek Backward': 'Seek Backward',
            'Seek Forward': 'Seek Forward',
            'Mute': 'Mute',
            'Unmute': 'Unmute',
            'Play': 'Play',
            'Pause': 'Pause',
            'Settings': 'Settings'
        }
    };

    function getText(key, lang = 'en') {
        return translations[lang][key] || key;
    }

    function setConsent(platform) {
        videoConsent[platform] = true;
        localStorage.setItem(consentKey, JSON.stringify(videoConsent));
        document.cookie = `${platform}_consent=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`;
    }

    function hasConsent(platform) {
        return videoConsent[platform] === true || document.cookie.includes(`${platform}_consent=true`);
    }

    function loadVideo(placeholder) {
        const platform = placeholder.dataset.platform;
        const videoId = placeholder.dataset.videoId;
        const mediaPlayer = placeholder.nextElementSibling;

        if (mediaPlayer && mediaPlayer.tagName.toLowerCase() === 'media-player') {
            mediaPlayer.style.display = '';
            mediaPlayer.setAttribute('src', `${platform}/${videoId}`);
            placeholder.style.display = 'none';
        } else {
            console.error('Media player element not found');
        }
    }

    function updatePlaceholder(placeholder, consented) {
        const button = placeholder.querySelector('.consent-button');
        const lang = document.documentElement.lang || 'en';
        
        if (consented) {
            button.textContent = getText('Consent given', lang);
            button.disabled = true;
        } else {
            button.textContent = getText('Load Video', lang);
            button.disabled = false;
        }
    }

    function initializePlaceholders() {
        document.querySelectorAll('.consent-placeholder').forEach(placeholder => {
            const platform = placeholder.dataset.platform;
            const consentButton = placeholder.querySelector('.consent-button');
            const consented = hasConsent(platform);

            updatePlaceholder(placeholder, consented);

            if (consented) {
                loadVideo(placeholder);
            } else {
                consentButton.addEventListener('click', () => {
                    setConsent(platform);
                    updatePlaceholder(placeholder, true);
                    loadVideo(placeholder);
                });
            }
        });
    }

    function initializeMediaPlayers() {
        document.querySelectorAll('media-player[data-video-platform]').forEach(player => {
            const platform = player.dataset.videoPlatform;
            if (hasConsent(platform)) {
                const videoId = player.dataset.videoId;
                player.style.display = '';
                player.setAttribute('src', `${platform}/${videoId}`);
                const placeholder = player.previousElementSibling;
                if (placeholder?.classList.contains('consent-placeholder')) {
                    placeholder.style.display = 'none';
                }
            }
        });
    }

    function applyTranslations() {
        const videoLayouts = document.querySelectorAll('media-video-layout');
        videoLayouts.forEach(layout => {
            const player = layout.closest('media-player');
            const lang = player?.getAttribute('lang') || 'en';
            layout.translations = translations[lang] || translations['en'];
        });

        document.querySelectorAll('.consent-placeholder').forEach(placeholder => {
            const lang = document.documentElement.lang || 'en';
            const button = placeholder.querySelector('.consent-button');
            const text = placeholder.querySelector('p');
            if (button) {
                button.textContent = getText('Load Video', lang);
            }
            if (text) {
                text.textContent = getText('Click here to load and play the video.', lang);
            }
        });
    }

    initializePlaceholders();
    initializeMediaPlayers();
    applyTranslations();

    // Beobachter für dynamisch hinzugefügte Elemente
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains('consent-placeholder')) {
                            initializePlaceholders();
                        }
                        if (node.tagName.toLowerCase() === 'media-player') {
                            initializeMediaPlayers();
                            applyTranslations();
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
