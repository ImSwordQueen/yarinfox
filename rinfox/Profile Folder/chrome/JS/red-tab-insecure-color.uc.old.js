(function() {
    const updateTabState = (browser) => {
        const tab = gBrowser.getTabForBrowser(browser);
        if (!tab) return;

        const ui = browser.securityUI;
        if (!ui) {
            tab.removeAttribute("user-security-state");
            return;
        }

        // Security flags for insecure (HTTP) or broken (Cert Error)
        const STATE_IS_INSECURE = Ci.nsIWebProgressListener.STATE_IS_INSECURE;
        const STATE_IS_BROKEN = Ci.nsIWebProgressListener.STATE_IS_BROKEN;
        const state = ui.state;

        // Apply attribute ONLY if the specific tab matches the error state
        if ((state & STATE_IS_INSECURE) || (state & STATE_IS_BROKEN)) {
            tab.setAttribute("user-security-state", "insecure");
        } else {
            tab.removeAttribute("user-security-state");
        }
    };

    const progressListener = {
        onSecurityChange: (browser) => updateTabState(browser),
        onLocationChange: (browser) => updateTabState(browser),
        onStateChange: (browser, webProgress, request, stateFlags, status) => {
            // Re-verify state when the page stops loading to catch late-detected issues
            if (stateFlags & Ci.nsIWebProgressListener.STATE_STOP) {
                updateTabState(browser);
            }
        }
    };

    // Initialize and handle delayed startup
    if (gBrowserInit.delayedStartupFinished) {
        gBrowser.addTabsProgressListener(progressListener);
    } else {
        let obs = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(obs, topic);
                gBrowser.addTabsProgressListener(progressListener);
            }
        };
        Services.obs.addObserver(obs, "browser-delayed-startup-finished");
    }
})();
