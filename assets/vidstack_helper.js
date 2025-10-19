/**
 * Vidstack Helper - Translations and Event Handling
 * 
 * Handles loading and applying translations for Vidstack player
 * Consent management should be handled by an external addon (e.g., Consent Manager)
 */
(function () {
    let translations = {};

    /**
     * Load translations from JSON file
     */
    async function loadTranslations() {
        try {
            translations = await (await fetch('/assets/addons/vidstack_player/translations.json')).json();
        } catch (error) {
            console.error('Vidstack: Error loading translations:', error);
            translations = { de: {}, en: {} };
        }
    }

    /**
     * Apply translations to all media players
     */
    function applyTranslations() {
        ['media-video-layout', 'media-audio-layout'].forEach(selector => {
            document.querySelectorAll(selector).forEach(layout => {
                const player = layout.closest('media-player');
                const lang = player?.getAttribute('lang') || document.documentElement.lang || 'en';
                
                // Apply translations from loaded JSON
                if (translations[lang]) {
                    layout.translations = translations[lang];
                } else if (translations['en']) {
                    // Fallback to English
                    layout.translations = translations['en'];
                }
            });
        });
    }

    /**
     * Initialize media players with translations
     */
    function initializeMediaPlayers() {
        document.querySelectorAll('media-player').forEach(player => {
            // Translations are applied automatically via applyTranslations()
            // No consent handling here - that should be managed by external addon
        });
        
        applyTranslations();
    }

    /**
     * Main initialization function
     */
    async function initialize() {
        await loadTranslations();
        initializeMediaPlayers();

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
                applyTranslations();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize on various events (cover different CMS scenarios)
    ['DOMContentLoaded', 'vsrun'].forEach(event => 
        document.addEventListener(event, initialize)
    );

    // REDAXO backend support - multiple events to ensure initialization
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('rex:ready', function() {
            initialize();
        });
        
        // Also initialize on pjax updates (mediapool, content edit)
        jQuery(document).on('pjax:end', function() {
            initialize();
        });
    }

    // If already loaded, initialize immediately
    if (['complete', 'interactive'].includes(document.readyState)) {
        initialize();
    }
})();
