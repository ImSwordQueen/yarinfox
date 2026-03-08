// ==UserScript==
// @name			RinFox Preferences to Attributes
// @description 	Sets root element attributes based on preferences (replaces @supports -moz-bool-pref)
// @author			RinFox
// @include			main
// @loadorder		0
// ==/UserScript==

// Firefox 140 compatibility - use different import methods
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

function setRinFoxAttributes() {
	const rootElement = document.documentElement;

	// Check preferences and set corresponding attributes
	const prefsToCheck = [
		{ pref: "RinFox.Appearance.IE8", attr: "data-rinfox-ie8", defaultVal: false },
		{ pref: "RinFox.Option.HideUnifiedExtensions", attr: "data-rinfox-hide-extensions", defaultVal: false },
		{ pref: "RinFox.Option.HideFakeDropdownGlyphs", attr: "data-rinfox-hide-glyphs", defaultVal: false },
		{ pref: "RinFox.Option.HideInnerBorders", attr: "data-rinfox-hide-inner-borders", defaultVal: false },
		{ pref: "rinfox.tweak.ie8", attr: "data-rinfox-ie8-tweak", defaultVal: false }
	];

	prefsToCheck.forEach(({ pref, attr, defaultVal }) => {
		try {
			const prefValue = Services.prefs.getBoolPref(pref, defaultVal);
			if (prefValue) {
				rootElement.setAttribute(attr, "true");
			} else {
				rootElement.removeAttribute(attr);
			}
		} catch (e) {
			// Preference doesn't exist, use default value
			if (defaultVal) {
				rootElement.setAttribute(attr, "true");
			} else {
				rootElement.removeAttribute(attr);
			}
		}
	});
}

// Set attributes on startup
setRinFoxAttributes();

// Listen for preference changes
const prefsToWatch = [
	"RinFox.Appearance.IE8",
	"RinFox.Option.HideUnifiedExtensions",
	"RinFox.Option.HideFakeDropdownGlyphs",
	"RinFox.Option.HideInnerBorders",
	"rinfox.tweak.ie8"
];

const rinFoxPrefObserver = {
	observe(subject, topic, data) {
		if (topic === "nsPref:changed") {
			setRinFoxAttributes();
		}
	}
};

prefsToWatch.forEach(pref => {
	try {
		Services.prefs.addObserver(pref, rinFoxPrefObserver);
	} catch (e) {
		console.error("Error observing preference " + pref + ":", e);
	}
});

// Set attributes again when DOM is fully loaded to ensure they're applied
window.addEventListener("load", setRinFoxAttributes);
