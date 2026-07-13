(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const STATUS_ICON_SELECTOR = "#addonbar .separator-2";
  
  // Custom Titlebar Configurations
  const TitlebarText = "Windows Internet Explorer"; 
  const PrivateBrowsingLabel = "[InPrivate]"; 
  const OfflineLabel = " - [Working Offline]";

  function toggleOfflineStatus() {
    const command = document.getElementById("cmd_toggleOfflineStatus");
    if (command?.doCommand) {
      command.doCommand();
    } else if (window.BrowserOffline?.toggleOfflineStatus) {
      window.BrowserOffline.toggleOfflineStatus();
    } else {
      Services.io.offline = !Services.io.offline;
    }
  }

  function handleIconClick(e) {
    if (e.button !== 0) return; // Only trigger on primary left-click

    try {
      e.preventDefault();
      e.stopPropagation();
      toggleOfflineStatus();
      updateOfflineStatus();
    } catch (err) {}
  }

  function updateOfflineStatus() {
    try {
      const isOffline = Services.io.offline;
      const win = document.getElementById("main-window");
      let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
      
      if (win) {
        const suffix = isOffline ? OfflineLabel : "";
        
        // 1. Assign the custom layout attributes to the main template
        win.setAttribute("data-content-title-default", "CONTENTTITLE - " + TitlebarText + suffix);
        win.setAttribute("data-title-default", TitlebarText + suffix);
        win.setAttribute("data-content-title-private", "CONTENTTITLE - " + TitlebarText + " - " + PrivateBrowsingLabel + suffix);
        win.setAttribute("data-title-private", TitlebarText + " - " + PrivateBrowsingLabel + suffix);
        
        if (isOffline) {
          win.setAttribute("data-is-offline", "true");
        } else {
          win.removeAttribute("data-is-offline");
        }
      }
      
      // 2. FORCE Firefox to run its native tab-switch repaint engine on demand
      if (window.gBrowser && typeof window.gBrowser.updateTitlebar === "function") {
        window.gBrowser.updateTitlebar();
      }
      
      // Update Status Bar Icons
      if (targets.length) {
        targets.forEach(el => {
          if (isOffline) {
            let msg = "You are currently working offline. To connect, click Work Offline on the File menu.";
            el.setAttribute("title", msg);     
            el.setAttribute("tooltiptext", msg);
            el.oncontextmenu = (e) => { e.preventDefault(); return false; };
          } else {
            el.removeAttribute("title");
            el.removeAttribute("tooltiptext");
            el.oncontextmenu = null;
          }
        });
      }
    } catch (e) {}
  }

  function init() {
    // Network state listener
    Services.obs.addObserver(updateOfflineStatus, "network:offline-status-changed");
    
    // Maintain titlebar tracking on basic tab switches natively
    window.gBrowser.tabContainer.addEventListener("TabSelect", updateOfflineStatus);
    window.gBrowser.tabContainer.addEventListener("TabAttrModified", updateOfflineStatus);

    let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
    targets.forEach(el => {
      el.addEventListener("click", handleIconClick, true);
    });
    
    updateOfflineStatus();
  }

  let checkInterval = setInterval(() => {
    if (document.querySelector(STATUS_ICON_SELECTOR)) {
      clearInterval(checkInterval);
      init();
    }
  }, 50);

  window.addEventListener("unload", () => {
    clearInterval(checkInterval);
    try {
      Services.obs.removeObserver(updateOfflineStatus, "network:offline-status-changed");
      window.gBrowser.tabContainer.removeEventListener("TabSelect", updateOfflineStatus);
      window.gBrowser.tabContainer.removeEventListener("TabAttrModified", updateOfflineStatus);
      let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
      targets.forEach(el => {
        el.removeEventListener("click", handleIconClick, true);
      });
    } catch (e) {}
  }, { once: true });

})();