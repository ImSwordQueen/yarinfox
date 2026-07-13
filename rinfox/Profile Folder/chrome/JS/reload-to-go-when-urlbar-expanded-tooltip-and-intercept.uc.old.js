(function() {
    function init() {
        const urlbar = document.getElementById("urlbar");
        const reloadButton = document.getElementById("reload-button");
        if (!urlbar || !reloadButton) return;

        const updateState = () => {
            const isExtended = urlbar.hasAttribute("breakout-extend");
            
            if (isExtended) {
                const urlText = window.gURLBar ? window.gURLBar.value : "";
                reloadButton.setAttribute("urlbar-results-active", "true");
                reloadButton.setAttribute("tooltiptext", `Go to "${urlText}" (Alt+Enter to open in a new tab)`);
            } else {
                reloadButton.removeAttribute("urlbar-results-active");

                let shortcut = "Ctrl+R"; 
                try {
                    const reloadCmd = document.getElementById("Browser:Reload");
                    shortcut = ShortcutUtils.prettifyShortcut(reloadCmd);
                } catch(e) {}
                
                reloadButton.setAttribute("tooltiptext", `Reload current page (${shortcut})`);
            }
        };

        const handleGo = (event) => {
            if (reloadButton.getAttribute("urlbar-results-active") === "true") {
                event.preventDefault();
                event.stopImmediatePropagation();

                const urlText = window.gURLBar ? window.gURLBar.value : "";
                if (!urlText) return;

                if (event.altKey || event.button === 1) {
                    gBrowser.loadOneTab(urlText, { inBackground: false, triggerPrincipal: Services.scriptSecurityManager.getSystemPrincipal() });
                } else {
                    openTrustedLinkIn(urlText, "current");
                }
                if (window.gURLBar) gURLBar.view.close();
            }
        };

        const observer = new MutationObserver(updateState);
        observer.observe(urlbar, { attributes: true, attributeFilter: ["breakout-extend"] });

        window.addEventListener("input", (e) => { if (e.target.id === "urlbar-input") updateState(); });
        if (window.gURLBar) {
            window.gURLBar.addEventListener("keydown", (e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") setTimeout(updateState, 0);
            });
        }

        reloadButton.addEventListener("command", handleGo, true);
        reloadButton.addEventListener("click", handleGo, true);
    }

    if (gBrowserInit.delayedStartupFinished) init();
    else Services.obs.addObserver(function listener(s, t) {
        Services.obs.removeObserver(listener, t);
        init();
    }, "browser-delayed-startup-finished");
})();
