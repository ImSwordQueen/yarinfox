// ==UserScript==
// @name			RinFox Wizard
// @description 	Opens the RinFox Wizard on first-time installs
// @author			Travis
// @include			main
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

function openRinFoxWizardWindow(verifyFirstRun) {
    if (verifyFirstRun) {
        let isRinFoxFirstRunFinished = false;
        try {
            isRinFoxFirstRunFinished = Services.prefs.getBoolPref("RinFox.parameter.isFirstRunFinished");
        } catch (error) {}
        
        if (!isRinFoxFirstRunFinished) {
            Services.prefs.setBoolPref('RinFox.parameter.isFirstRunFinished', false)

            launchRinFoxWizard();
        }
    } else {
        launchRinFoxWizard();
    }
}

function launchRinFoxWizard() {
    var features = "chrome,centerscreen,resizeable=no,dependent,modal";
    window.openDialog('chrome://userchrome/content/windows/rinFoxWizard/rinFoxWizard.xhtml', "Set Up RinFox", features); 
};