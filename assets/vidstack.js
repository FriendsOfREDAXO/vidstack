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
            // Store the original attributes and innerHTML
            const attributes = {};
            for (let i = 0; i < mediaPlayer.attributes.length; i++) {
                const attr = mediaPlayer.attributes[i];
                if (attr.name !== 'src') {
                    attributes[attr.name] = attr.value;
                }
            }
            const innerHTML = mediaPlayer.innerHTML;
            
            // Remove the existing media player
            mediaPlayer.remove();
            
            // Create a new media player element with the correct src from the start
            const newPlayer = document.createElement('media-player');
            
            // Set all attributes including the new src
            for (const [name, value] of Object.entries(attributes)) {
                newPlayer.setAttribute(name, value);
            }
            newPlayer.setAttribute('src', `${platform}/${videoId}`);
            
            // Set inner HTML
            newPlayer.innerHTML = innerHTML;
            
            // Insert the new player after the placeholder
            placeholder.insertAdjacentElement('afterend', newPlayer);
            
            // Hide the placeholder
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
            
            // Check if src is already set - if so, the player is already properly configured
            if (player.getAttribute('src')) {
                // Make sure the player is visible and the placeholder is hidden
                player.style.display = '';
                const placeholder = player.previousElementSibling;
                if (placeholder?.classList.contains('consent-placeholder')) {
                    placeholder.style.display = 'none';
                }
                return;
            }
            
            // Only recreate the player if no src is set
            
            // Store the original attributes and innerHTML
            const attributes = {};
            for (let i = 0; i < player.attributes.length; i++) {
                const attr = player.attributes[i];
                if (attr.name !== 'src' && attr.name !== 'style') {
                    attributes[attr.name] = attr.value;
                }
            }
            const innerHTML = player.innerHTML;
            const placeholder = player.previousElementSibling;
            
            // Remove the existing media player
            player.remove();
            
            // Create a new media player element with the correct src from the start
            const newPlayer = document.createElement('media-player');
            
            // Set all attributes including the new src
            for (const [name, value] of Object.entries(attributes)) {
                newPlayer.setAttribute(name, value);
            }
            newPlayer.setAttribute('src', `${platform}/${videoId}`);
            
            // Set inner HTML
            newPlayer.innerHTML = innerHTML;
            
            // Insert the new player
            if (placeholder?.classList.contains('consent-placeholder')) {
                placeholder.insertAdjacentElement('afterend', newPlayer);
                placeholder.style.display = 'none';
            } else {
                // If no placeholder, insert at the end of the container
                const container = placeholder?.parentNode || document.body;
                container.appendChild(newPlayer);
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
