// ==UserScript==
// @name        BeautyFox - Locale System
// @description Custom locale system until we figure out .properties.
// @author      AngelBruni
// @loadOrder   3
// ==/UserScript==

// FIXME: INTL not working properly or... SWITCH TO .properties AND DITCH THIS WHOLE SYSTEM.
if (typeof Services === "undefined") {
    try {
        ChromeUtils.defineESModuleGetters(this, {
            Services: "resource://gre/modules/Services.sys.mjs",
        });
    } catch (e) {
        try {
            var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
        } catch (e2) {
            console.error("Failed to load Services:", e, e2);
        }
    }
}

var userLanguageI, userLanguageT;
var IsIE8;
var translations = {};
var _localeInitialized = false;
var _applyTimeout = null;

function initializeLanguageVars() {
    userLanguageI = navigator.language.split('-');
    userLanguageT = navigator.language;
}

function loadTranslations(lang, region) {
    return fetch(`chrome://userchrome/content/jsonLocale/${lang}/${region}.json`)
        .then(response => response.json())
        .then(data => {
            if (!translations[lang]) { translations[lang] = {}; }
            translations[lang][region] = data;
        })
        .catch(error => {
            // Silently ignore missing locale files
        });
}

async function loadLocale() {
    // Prevent multiple simultaneous loads
    if (_localeInitialized) return;

    if (!userLanguageI || !userLanguageT) {
        initializeLanguageVars();
    }

    const lang = userLanguageI[0], region = userLanguageI[1] || 'fallback';

    try {
        // Load English fallback first
        await loadTranslations('en', 'fallback');

        if (!translations['en'] || !translations['en']['fallback']) {
            console.error('LocaleSystem: Failed to load English fallback');
            return;
        }

        _localeInitialized = true;

        // Try to load user language (don't fail if missing)
        await loadTranslations(lang, 'fallback').catch(() => {});
        await loadTranslations(lang, region).catch(() => {});

        applyTranslations();

        // Debounced re-apply for late-loading elements
        if (_applyTimeout) clearTimeout(_applyTimeout);
        _applyTimeout = setTimeout(() => {
            applyTranslations();
            _applyTimeout = null;
        }, 500);
    } catch (e) {
        console.error('LocaleSystem: Error in loadLocale:', e);
    }
}

function applyTranslations() {
    userLanguageT = navigator.language;

    const elements = document.querySelectorAll('[locale]');

    // Batch DOM operations to reduce reflows
    const updates = []; // Store updates to apply in batch

    elements.forEach(element => {
        const lang = userLanguageT.split('-')[0];
        const key = element.getAttribute('locale');
        let text = "";

        // Try to find translation
        if (translations[lang] && translations[lang]['fallback'] && translations[lang]['fallback'][key]) {
            text = translations[lang]['fallback'][key];
        } else if (translations['en'] && translations['en']['fallback'] && translations['en']['fallback'][key]) {
            text = translations['en']['fallback'][key];
        } else {
            return; // Skip if no translation
        }

        const IEVersion = '%IEVersion';
        if (text !== undefined) {
            // Get IE8 pref lazily and cache it
            if (IsIE8 === undefined) {
                try {
                    IsIE8 = pref("RinFox.Appearance.IE8").tryGet.bool();
                    if (IsIE8 === undefined) IsIE8 = false;
                } catch (e) {
                    IsIE8 = false;
                }
            }
            text = text.replace(new RegExp(IEVersion, 'g'), IsIE8 ? '8' : '7');
        }

        // Apply translation based on element type
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'window') {
            element.setAttribute('title', text);
        } else if (tagName === 'checkbox' || tagName === 'menuitem' || tagName === 'menu') {
            element.setAttribute('label', text);
        } else if (tagName === 'toolbarbutton') {
            // Use setAttributes from utils
            setAttributes(element, { 'label': text, 'tooltiptext': text });
        } else {
            element.textContent = text;
        }
    });
}

var prefObserver = {
    observe: function (subject, topic, data) {
        if (topic == 'nsPref:changed') {
            _localeInitialized = false;
            loadLocale().catch(error => console.error('LocaleSystem: Error reloading:', error));
        }
    }
};

function initializeLocaleSystem() {
    try {
        initializeLanguageVars();
        loadLocale().catch(e => console.error('LocaleSystem: Initial load failed:', e));

        if (Services && Services.prefs) {
            Services.prefs.addObserver('intl.locale.requested', prefObserver, false);
        }
    } catch (e) {
        console.error('LocaleSystem: Error initializing:', e);
    }
}

// Wait for window to be fully loaded
if (document.readyState === 'loading') {
    window.addEventListener('load', initializeLocaleSystem, { once: true });
} else {
    setTimeout(initializeLocaleSystem, 100);
}

// Expose for scriptsLoader
window.loadLocale = loadLocale;
