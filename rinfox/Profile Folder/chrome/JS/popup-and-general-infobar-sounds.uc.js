(function() {
  if (location.href !== 'chrome://browser/content/browser.xhtml') return;

  // 1. Registry paths matching your specific Windows sound events
  const REG_PATH_POPUP = "AppEvents\\Schemes\\Apps\\Explorer\\BlockedPopup\\.Current";
  const REG_PATH_INFOBAR = "AppEvents\\Schemes\\Apps\\Explorer\\SecurityBand\\.Current";

  // Hard fallbacks if registry keys are totally missing or corrupted
  const DEFAULT_POPUP = "file:///C:/Windows/Media/Windows%20Pop-up%20Blocked.wav";
  const DEFAULT_INFOBAR = "file:///C:/Windows/Media/Windows%20Information%20Bar.wav";

  const COOLDOWN_POPUP = 300;
  const COOLDOWN_INFOBAR = 1000;

  let playerPopup = null, cachedPathPopup = null, uriPopup = null;
  let playerInfo = null, cachedPathInfo = null, uriInfo = null;
  let lastPopupTime = 0;
  let lastInfoTime = 0;

  // Helper function to dynamically parse real-time paths from the registry
  const getRegistrySoundPath = (regPath, fallbackDefault) => {
    try {
      let regKey = Cc["@mozilla.org/windows-registry-key;1"].createInstance(Ci.nsIWindowsRegKey);
      regKey.open(regKey.ROOT_KEY_CURRENT_USER, regPath, regKey.ACCESS_READ);
      
      let rawPath = regKey.readStringValue("");
      regKey.close();

      if (!rawPath || rawPath.trim() === "") {
        return null; // Scheme item set to "(None)" -> suppress sound engine execution
      }

      // Expand system macro tags like %SystemRoot%
      if (rawPath.includes("%")) {
        let env = Cc["@mozilla.org/process/environment;1"].getService(Ci.nsIEnvironment);
        rawPath = rawPath.replace(/%([^%]+)%/g, (_, varName) => env.get(varName));
      }

      // Convert format strings over to clean URI addresses
      if (!rawPath.startsWith("file:///")) {
        rawPath = "file:///" + rawPath.replace(/\\/g, "/");
      }

      return rawPath;
    } catch (e) {
      return fallbackDefault;
    }
  };

  const playEffect = (type, val) => {
    const now = Date.now();
    const isPopup = (type === "popup");

    if (isPopup) {
      if (now - lastPopupTime < COOLDOWN_POPUP) return;
    } else {
      if (now - lastInfoTime < COOLDOWN_INFOBAR) return;
    }

    try {
      let io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

      if (isPopup) {
        let currentPopupPath = getRegistrySoundPath(REG_PATH_POPUP, DEFAULT_POPUP);
        if (!currentPopupPath) return; // Silent execution tracking

        // Re-initialize only if the registry sound file target changes
        if (!playerPopup || currentPopupPath !== cachedPathPopup) {
          uriPopup = io.newURI(currentPopupPath);
          playerPopup = Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound);
          if (playerPopup.init) playerPopup.init();
          cachedPathPopup = currentPopupPath;
        }
        playerPopup.play(uriPopup);
        lastPopupTime = now;
      } else {
        let currentInfoPath = getRegistrySoundPath(REG_PATH_INFOBAR, DEFAULT_INFOBAR);
        if (!currentInfoPath) return; // Silent execution tracking

        if (!playerInfo || currentInfoPath !== cachedPathInfo) {
          uriInfo = io.newURI(currentInfoPath);
          playerInfo = Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound);
          if (playerInfo.init) playerInfo.init();
          cachedPathInfo = currentInfoPath;
        }
        playerInfo.play(uriInfo);
        lastInfoTime = now;
      }
      console.log(`[MasterSound] Dynamic scheme triggered for ${type}: ${val || ""}`);
    } catch (e) {
      console.error("[MasterSound] Dynamic playback error:", e);
    }
  };

  const watchInternalRefresh = (host) => {
    let attempts = 0;
    let shadowCheck = setInterval(() => {
      const shadow = host.shadowRoot;
      if (shadow) {
        clearInterval(shadowCheck);
        const internalObserver = new MutationObserver(() => {
          playEffect("popup", "refresh");
        });
        internalObserver.observe(shadow, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
          attributeFilter: ["data-l10n-args"]
        });
      }
      if (++attempts > 50) clearInterval(shadowCheck);
    }, 100);
  };

  const init = () => {
    window.addEventListener("AlertActive", (event) => {
      try {
        const nBox = gBrowser.getNotificationBox();
        const notification = nBox.currentNotification;
        if (notification) {
          let val = notification.getAttribute("value");
          if (val === "popup-blocked") return;
          playEffect("infobar", val);
        }
      } catch (e) {}
    }, true);

    const popupObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            let host = (node.getAttribute?.("value") === "popup-blocked") ?
              node : node.querySelector?.('[value="popup-blocked"]');
            if (host) {
              playEffect("popup", "initial");
              watchInternalRefresh(host);
              break;
            }
          }
        }
      }
    });

    popupObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    console.log("[MasterSound] Monitoring active: Syncing Popups and Infobars to active Windows registry sound nodes.");
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