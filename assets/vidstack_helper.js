/**
 * Vidstack Helper - Translation Support
 * Consent management is handled by the Consent Manager AddOn
 */
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

    function applyTranslations() {
        ['media-video-layout', 'media-audio-layout'].forEach(selector => {
            document.querySelectorAll(selector).forEach(layout => {
                const player = layout.closest('media-player');
                const lang = player?.getAttribute('lang') || 'en';
                layout.translations = translations[lang] || translations['en'];
            });
        });
    }

    async function initializeScript() {
        await loadTranslations();
        applyTranslations();

        // Observer for dynamically added players
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName.toLowerCase() === 'media-player') {
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
