/**
 * Vidstack Helper - Translations and Event Handling
 * 
 * Handles loading and applying translations for Vidstack player
 * Consent management should be handled by an external addon (e.g., Consent Manager)
 */
(function () {
    let vidstackTranslations = {};

    /**
     * Load translations from JSON file
     */
    async function vidstackLoadTranslations() {
        try {
            vidstackTranslations = await (await fetch('/assets/addons/vidstack_player/translations.json')).json();
        } catch (error) {
            console.error('Vidstack: Error loading translations:', error);
            vidstackTranslations = { de: {}, en: {} };
        }
    }

    /**
     * Apply translations to all media players
     */
    function vidstackApplyTranslations() {
        ['media-video-layout', 'media-audio-layout'].forEach(selector => {
            document.querySelectorAll(selector).forEach(layout => {
                const player = layout.closest('media-player');
                const lang = player?.getAttribute('lang') || document.documentElement.lang || 'en';
                
                // Apply translations from loaded JSON
                if (vidstackTranslations[lang]) {
                    layout.translations = vidstackTranslations[lang];
                } else if (vidstackTranslations['en']) {
                    // Fallback to English
                    layout.translations = vidstackTranslations['en'];
                }
            });
        });
    }

    /**
     * Initialize media players with translations
     */
    function vidstackInitializeMediaPlayers() {
        document.querySelectorAll('media-player').forEach(player => {
            // Translations are applied automatically via vidstackApplyTranslations()
            // No consent handling here - that should be managed by external addon
        });
        
        vidstackApplyTranslations();
    }

    /**
     * Main initialization function
     */
    async function vidstackInitialize() {
        await vidstackLoadTranslations();
        vidstackInitializeMediaPlayers();

        // Watch for dynamically added players (AJAX, etc.)
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName?.toLowerCase() === 'media-player' ||
                                node.querySelector?.('media-player')) {
                                needsUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (needsUpdate) {
                vidstackApplyTranslations();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize on various events (cover different CMS scenarios)
    ['DOMContentLoaded', 'vsrun'].forEach(event => 
        document.addEventListener(event, vidstackInitialize)
    );

    // REDAXO backend support - multiple events to ensure initialization
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('rex:ready', function() {
            vidstackInitialize();
        });
        
        // Also initialize on pjax updates (mediapool, content edit)
        jQuery(document).on('pjax:end', function() {
            vidstackInitialize();
        });
    }

    // If already loaded, initialize immediately
    if (['complete', 'interactive'].includes(document.readyState)) {
        vidstackInitialize();
    }
})();
