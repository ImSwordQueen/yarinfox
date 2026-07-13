// ==UserScript==
// @name        RinFox Preferences to Attributes
// @description Maps RinFox preferences to browser-root attributes
// @include     main
// @loadOrder   0
// ==/UserScript==

const RinFoxPreferenceServices = Services;

const rinFoxPreferenceAttributes = [
    ["RinFox.Appearance.IE8", "data-rinfox-ie8"],
    ["RinFox.Option.HideUnifiedExtensions", "data-rinfox-hide-extensions"],
    ["RinFox.Option.HideFakeDropdownGlyphs", "data-rinfox-hide-glyphs"],
    ["RinFox.Option.HideInnerBorders", "data-rinfox-hide-inner-borders"],
    ["rinfox.statusbar.disabled", "data-rinfox-statusbar-disabled"],
];

function updateRinFoxPreferenceAttributes() {
    const root = document.documentElement;

    for (const [prefName, attribute] of rinFoxPreferenceAttributes) {
        root.toggleAttribute(
            attribute,
            RinFoxPreferenceServices.prefs.getBoolPref(prefName, false)
        );
    }
}

const rinFoxPreferenceObserver = {
    observe(_subject, topic) {
        if (topic === "nsPref:changed") {
            updateRinFoxPreferenceAttributes();
        }
    },
};

updateRinFoxPreferenceAttributes();
for (const [prefName] of rinFoxPreferenceAttributes) {
    RinFoxPreferenceServices.prefs.addObserver(prefName, rinFoxPreferenceObserver);
}
window.addEventListener("load", updateRinFoxPreferenceAttributes, { once: true });
window.addEventListener(
    "unload",
    () => {
        for (const [prefName] of rinFoxPreferenceAttributes) {
            RinFoxPreferenceServices.prefs.removeObserver(prefName, rinFoxPreferenceObserver);
        }
    },
    { once: true }
);
