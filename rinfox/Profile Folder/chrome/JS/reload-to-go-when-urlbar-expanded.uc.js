(function() {
    function init() {
        const urlbarInput = document.getElementById("urlbar");
        const reloadButton = document.getElementById("reload-button");

        if (!urlbarInput || !reloadButton) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "breakout-extend") {
                    if (urlbarInput.hasAttribute("breakout-extend")) {
                        reloadButton.setAttribute("urlbar-results-active", "true");
                    } else {
                        reloadButton.removeAttribute("urlbar-results-active");
                    }
                }
            });
        });

        observer.observe(urlbarInput, { 
            attributes: true, 
            attributeFilter: ["breakout-extend"] 
        });
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished") {
                Services.obs.removeObserver(delayedListener, topic);
                init();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})();
