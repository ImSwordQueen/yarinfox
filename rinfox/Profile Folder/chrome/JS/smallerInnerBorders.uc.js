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

function checkSmallBorderHackStatus() {
    try {
        return Services.prefs.getBoolPref("RinFox.Option.SmallerInnerBordersHack");
    } catch (error) {
        return false;
    }
}

const isSmallBorderBool = checkSmallBorderHackStatus();

function applySmallBorderHack() {
	if (isSmallBorderBool) {
		document.documentElement.setAttribute('chromemargin', '2,2,2,2');
	}
}