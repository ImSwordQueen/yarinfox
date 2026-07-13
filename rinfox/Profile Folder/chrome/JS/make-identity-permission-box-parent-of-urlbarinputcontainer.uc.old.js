(function() {
    function init() {
        let permissionBox = document.getElementById("identity-permission-box");
        let targetParent = document.getElementById("urlbar-input-container");
        let identityBox = document.getElementById("identity-box");

        if (permissionBox && targetParent && identityBox) {
            targetParent.insertBefore(permissionBox, identityBox);
        }
    }

    if (gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                init();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})();
