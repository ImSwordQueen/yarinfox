(function() {
    if (location.href !== 'chrome://browser/content/browser.xhtml') return;

    const REG_PATH = "AppEvents\\Schemes\\Apps\\Explorer\\Navigating\\.Current";
    const DEFAULT_FALLBACK = "file:///C:/Windows/Media/Windows%20Navigation%20Start.wav";
    const TRIGGER_COOLDOWN = 150; 
    
    let cachedSoundURI = null;
    let cachedRegistryPath = null;
    let soundPlayer = null;
    let lastPlayTime = 0;
    

    const getRegistrySoundPath = () => {
        try {
            let regKey = Cc["@mozilla.org/windows-registry-key;1"].createInstance(Ci.nsIWindowsRegKey);
            regKey.open(regKey.ROOT_KEY_CURRENT_USER, REG_PATH, regKey.ACCESS_READ);
            let rawPath = regKey.readStringValue("");
            regKey.close();

            if (!rawPath || rawPath.trim() === "") return null;

            if (rawPath.includes("%")) {
                let env = Cc["@mozilla.org/process/environment;1"].getService(Ci.nsIEnvironment);
                rawPath = rawPath.replace(/%([^%]+)%/g, (_, varName) => env.get(varName));
            }

            if (!rawPath.startsWith("file:///")) {
                rawPath = "file:///" + rawPath.replace(/\\/g, "/");
            }

            return rawPath;
        } catch (e) {
            return DEFAULT_FALLBACK;
        }
    };

    const playSoundInstant = () => {
        const now = Date.now();
        if (now - lastPlayTime < TRIGGER_COOLDOWN) return;
        
        try {
            let currentSoundPath = getRegistrySoundPath();
            if (!currentSoundPath) return; 

            if (!soundPlayer || currentSoundPath !== cachedRegistryPath) {
                let ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
                cachedSoundURI = ioService.newURI(currentSoundPath);
                soundPlayer = Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound);
                cachedRegistryPath = currentSoundPath;
            }
            
            soundPlayer.play(cachedSoundURI);
            lastPlayTime = now;
        } catch (err) {
            console.error("[uc.js Sound] Dynamic Playback Error:", err);
        }
    };

    const init = () => {
        window.addEventListener("click", (e) => {
            if (e.button !== 0) return;

            const clickedTab = e.target.closest(".tabbrowser-tab");
            const clickedCloseButton = e.target.closest(".tab-close-button");
            if (clickedTab && !clickedCloseButton && clickedTab !== gBrowser.selectedTab) {
                playSoundInstant();
            }
        }, true);

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === "busy" && mutation.target.hasAttribute("busy")) {
                    if (mutation.target === gBrowser.selectedTab) {
                        playSoundInstant();
                    }
                }
            }
        });

        const tabContainer = gBrowser.tabContainer.arrowScrollbox;
        observer.observe(tabContainer, { 
            attributes: true, 
            subtree: true, 
            attributeFilter: ["busy"] 
        });

        console.log("[uc.js Sound] Logic Active: Following sound scheme.");
    };

    if (typeof gBrowserInit !== "undefined" && gBrowserInit.delayedStartupFinished) {
        init();
    } else {
        let obs = (subject, topic) => {
            if (topic === "browser-delayed-startup-finished" && subject === window) {
                Services.obs.removeObserver(obs, topic);
                init();
            }
        };
        Services.obs.addObserver(obs, "browser-delayed-startup-finished");
    }
})();