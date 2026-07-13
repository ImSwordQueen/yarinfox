(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const STATUS_ICON_SELECTOR = "#addonbar .separator-4";
  let currentPlayingTabs = []; // Keep a scoped array reference for the click handler

  function isTabPlaying(tab) {
    return !!(tab && (tab.soundPlaying || tab.hasAttribute?.("soundplaying")));
  }

  function updateMediaStatus() {
    try {
      let win = document.getElementById("main-window");
      if (!win) return;

      let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
      let tabs = (window.gBrowser && window.gBrowser.tabs) ? window.gBrowser.tabs : [];
      
      currentPlayingTabs = tabs.filter(isTabPlaying);

      if (currentPlayingTabs.length > 0) {
        win.setAttribute("data-media-playing", "true");
        
        if (targets.length) {
          let msg = "";
          
          if (currentPlayingTabs.length > 1) {
            msg = "Multiple tabs are currently playing audio. Click here to cycle through them.";
          } else {
            // Check if the single playing tab is the one currently selected
            if (currentPlayingTabs[0] === window.gBrowser.selectedTab) {
              msg = "This tab is currently playing audio.";
            } else {
              msg = "A tab is currently playing audio. Click here to switch to it.";
            }
          }

          targets.forEach(el => {
            el.setAttribute("title", msg);
            el.setAttribute("tooltiptext", msg);
            el.oncontextmenu = (e) => { e.preventDefault(); return false; };
            
            // Bind the click navigation handler securely
            if (!el.hasAttribute("data-click-bound")) {
              el.setAttribute("data-click-bound", "true");
              el.addEventListener("click", handleIconClick);
            }
          });
        }
      } else {
        win.removeAttribute("data-media-playing");
        
        if (targets.length) {
          targets.forEach(el => {
            el.removeAttribute("title");
            el.removeAttribute("tooltiptext");
            el.oncontextmenu = null;
            el.removeAttribute("data-click-bound");
            el.removeEventListener("click", handleIconClick);
          });
        }
      }
    } catch (e) {}
  }

  function handleIconClick(e) {
    if (e.button !== 0 || !currentPlayingTabs.length) return; // Only trigger on primary left-click
    
    try {
      e.preventDefault();
      e.stopPropagation();

      if (currentPlayingTabs.length === 1) {
        // If only one tab is playing audio, switch directly to it
        window.gBrowser.selectedTab = currentPlayingTabs[0];
      } else {
        // If multiple tabs are playing audio, cycle between them
        let activeIndex = currentPlayingTabs.indexOf(window.gBrowser.selectedTab);
        
        // Find the next tab in line; wrap around to the first one if we are at the end
        let nextIndex = (activeIndex + 1) % currentPlayingTabs.length;
        window.gBrowser.selectedTab = currentPlayingTabs[nextIndex];
      }
    } catch (err) {}
  }

  let updateInterval = null;

  function init() {
    window.gBrowser.tabContainer.addEventListener("TabSelect", updateMediaStatus);
    window.gBrowser.tabContainer.addEventListener("TabClose", updateMediaStatus);
    window.gBrowser.tabContainer.addEventListener("TabAttrModified", updateMediaStatus);
    updateInterval = setInterval(updateMediaStatus, 400);
    updateMediaStatus();
  }

  let mountAttempts = 0;
  let checkInterval = setInterval(() => {
    mountAttempts++;
    if (document.querySelector(STATUS_ICON_SELECTOR) || mountAttempts > 40) {
      clearInterval(checkInterval);
      init();
    }
  }, 50);

  window.addEventListener("unload", () => {
    clearInterval(checkInterval);
    clearInterval(updateInterval);
    try {
      window.gBrowser.tabContainer.removeEventListener("TabSelect", updateMediaStatus);
      window.gBrowser.tabContainer.removeEventListener("TabClose", updateMediaStatus);
      window.gBrowser.tabContainer.removeEventListener("TabAttrModified", updateMediaStatus);
      
      let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
      targets.forEach(el => el.removeEventListener("click", handleIconClick));
    } catch (e) {}
  }, { once: true });
})();