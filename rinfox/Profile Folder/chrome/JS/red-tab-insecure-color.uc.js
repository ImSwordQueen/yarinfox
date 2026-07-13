(function() {
    const insecureClasses = [
        "notSecure", 
        "mixedActiveContent", 
        "httpsOnlyErrorPage", 
        "weakCipher", 
        "mixedDisplayContent", 
        "mixedDisplayContentLoadedActiveBlocked", 
        "certUserOverridden", 
        "certErrorPage",
        "unknownIdentity"
    ];

    function updateCurrentTab() {
        let tab = gBrowser.selectedTab;
        let identityBox = document.getElementById("identity-box");
        
        let isInsecure = insecureClasses.some(cls => identityBox.classList.contains(cls));

        if (isInsecure && identityBox.getAttribute("pageproxystate") === "valid") {
            tab.setAttribute("user-security-state", "insecure");
        } else {
            if (identityBox.classList.contains("verifiedDomain") || 
                identityBox.classList.contains("verifiedIdentity")) {
                tab.removeAttribute("user-security-state");
            }
        }
    }

    window.addEventListener("LocationChange", updateCurrentTab);
    window.addEventListener("TabSelect", updateCurrentTab);
    
    const observer = new MutationObserver(updateCurrentTab);
    const config = { attributes: true, attributeFilter: ['class'] };
    
    window.addEventListener("load", () => {
        const target = document.getElementById("identity-box");
        if (target) observer.observe(target, config);
    }, { once: true });

})();
