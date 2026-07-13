// ==UserScript==
// @name			RinFox Wizard
// @description 	Opens the RinFox Wizard on first-time installs
// @author			Travis
// @include			main
// ==/UserScript==

const RinFoxWizardServices = Services;

function openRinFoxWizardWindow(verifyFirstRun) {
    if (verifyFirstRun) {
        let isRinFoxFirstRunFinished = false;
        try {
            isRinFoxFirstRunFinished = RinFoxWizardServices.prefs.getBoolPref("RinFox.parameter.isFirstRunFinished");
        } catch (error) {}
        
        if (!isRinFoxFirstRunFinished) {
            RinFoxWizardServices.prefs.setBoolPref('RinFox.parameter.isFirstRunFinished', false)

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