(function () {
    let translations = {};

    async function loadTranslations() {
        try {
            translations = await (await fetch('/assets/addons/vidstack/translations.json')).json();
        } catch (error) {
            console.error('Fehler beim Laden der Übersetzungen:', error);
            translations = { de: {}, en: {} };
        }
    }

    function getText(key, lang = 'en') {
        return (translations[lang] && translations[lang][key]) || key;
    }

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
        const { platform, videoId } = placeholder.dataset;
        const mediaPlayer = placeholder.nextElementSibling;

        if (mediaPlayer?.tagName.toLowerCase() === 'media-player') {
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

        if (button) {
            button.textContent = getText(consented ? 'Consent given' : 'Load Video', lang);
            button.disabled = consented;
        }
    }

    function initializePlaceholder(placeholder) {
        const platform = placeholder.dataset.platform;
        const consented = hasConsent(platform);

        updatePlaceholder(placeholder, consented);

        if (consented) {
            loadVideo(placeholder);
        } else {
            const consentButton = placeholder.querySelector('.consent-button');
            if (consentButton) {
                consentButton.addEventListener('click', () => {
                    setConsent(platform);
                    updatePlaceholder(placeholder, true);
                    loadVideo(placeholder);
                });
            } else {
                console.error('Consent button not found in placeholder');
            }
        }
    }

    function initializeMediaPlayer(player) {
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
    }

    function applyTranslations() {
        ['media-video-layout', 'media-audio-layout'].forEach(selector => {
            document.querySelectorAll(selector).forEach(layout => {
                const player = layout.closest('media-player');
                const lang = player?.getAttribute('lang') || 'en';
                layout.translations = translations[lang] || translations['en'];
            });
        });
    }

    function initializeElements() {
        document.querySelectorAll('.consent-placeholder').forEach(initializePlaceholder);
        document.querySelectorAll('media-player[data-video-platform]').forEach(initializeMediaPlayer);
        applyTranslations();
    }

    async function initializeScript() {
        await loadTranslations();
        initializeElements();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList.contains('consent-placeholder')) {
                                initializePlaceholder(node);
                            }
                            if (node.tagName.toLowerCase() === 'media-player') {
                                initializeMediaPlayer(node);
                                applyTranslations();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    ['DOMContentLoaded', 'vsrun'].forEach(event => 
        document.addEventListener(event, initializeScript)
    );

    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('rex:ready', initializeScript);
    }

    if (['complete', 'interactive'].includes(document.readyState)) {
        initializeScript();
    }
})();
