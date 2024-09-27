(function() {
    let translations = {};

    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            translations = await response.json();
        } catch (error) {
            console.error('Fehler beim Laden der Übersetzungen:', error);
            // Fallback zu leeren Übersetzungen, wenn das Laden fehlschlägt
            translations = { de: {}, en: {} };
        }
    }

    function getText(key, lang = 'en') {
        return (translations[lang] && translations[lang][key]) || key;
    }

    async function initializeScript() {
        await loadTranslations();

        const consentKey = 'video_consent';
        let videoConsent = JSON.parse(localStorage.getItem(consentKey) || '{}');

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
    }

    // Skript bei DOMContentLoaded ausführen
    document.addEventListener('DOMContentLoaded', initializeScript);

    // Skript bei rex:ready ausführen, wenn jQuery verfügbar ist
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('rex:ready', initializeScript);
    }

    // Skript bei vsrun-Event ausführen
    document.addEventListener('vsrun', initializeScript);

    // Skript sofort ausführen, wenn das DOM bereits geladen ist
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    }
})();
