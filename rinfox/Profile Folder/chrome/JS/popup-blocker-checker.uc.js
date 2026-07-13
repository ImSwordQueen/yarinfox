(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const STATUS_ICON_SELECTOR = "#addonbar .separator-3";

  // Navigation function upgraded to go directly to the Permissions section anchor
  function openPermissionsSettings() {
    if (typeof openPreferences === "function") {
      openPreferences("privacy-permissions");
    } else {
      window.gBrowser.selectedTab = window.gBrowser.addTrustedTab("about:preferences#privacy-permissions");
    }
  }

  function getBlockedPopupCount() {
    let popupBlocker = gBrowser.selectedBrowser?.popupBlocker;
    if (typeof popupBlocker?.getBlockedPopupCount == "function") {
      return popupBlocker.getBlockedPopupCount();
    }

    let notificationBox = typeof gBrowser.readNotificationBox == "function" ?
      gBrowser.readNotificationBox() :
      gBrowser.getNotificationBox();
    return notificationBox?.getNotificationWithValue("popup-blocked") ? 1 : 0;
  }

  function openBlockedPopupOptions(anchor, event) {
    let popup = document.getElementById("blockedPopupOptions");
    if (!popup) return;

    if (popup.state == "open" || popup.state == "showing") {
      popup.hidePopup();
      return;
    }

    popup.openPopup(anchor, "after_start", 0, 0, true, false, event);
  }

  function handleIconClick(e) {
    let win = document.getElementById("main-window");
    if (!win) return;

    if (win.hasAttribute("data-popup-active-blocked")) {
      e.preventDefault();
      e.stopPropagation();
      openBlockedPopupOptions(e.currentTarget, e);
    } else if (win.hasAttribute("data-popup-blocker-disabled")) {
      e.preventDefault();
      e.stopPropagation();
      openPermissionsSettings();
    }
  }

  function handleIconContextMenu(e) {
    let win = document.getElementById("main-window");
    if (!win) return;

    e.preventDefault();
    e.stopPropagation();

    if (win.hasAttribute("data-popup-active-blocked")) {
      openBlockedPopupOptions(e.currentTarget, e);
    }
  }

  function updatePopupIcon() {
    try {
      let win = document.getElementById("main-window");
      let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
      if (!win || !targets.length) return;

      let activeBlock = getBlockedPopupCount() > 0;

      let state = null;
      let msg = "";

      if (activeBlock) {
        state = "data-popup-active-blocked";
        msg = "Pop-ups were blocked.";
      } else if (!Services.prefs.getBoolPref("dom.disable_open_during_load", true)) {
        state = "data-popup-blocker-disabled";
        msg = "Pop-up blocking is currently disabled. Click here to open settings.";
      }

      if (state) {
        let other = (state === "data-popup-active-blocked") ? "data-popup-blocker-disabled" : "data-popup-active-blocked";
        win.removeAttribute(other);
        win.setAttribute(state, "true");

        targets.forEach(el => {
          el.setAttribute("title", msg);
          el.setAttribute("tooltiptext", msg);
          el.addEventListener("contextmenu", handleIconContextMenu, true);
        });
      } else {
        win.removeAttribute("data-popup-active-blocked");
        win.removeAttribute("data-popup-blocker-disabled");
        targets.forEach(el => {
          el.removeAttribute("title");
          el.removeAttribute("tooltiptext");
          el.removeEventListener("contextmenu", handleIconContextMenu, true);
        });
      }
    } catch (e) {}
  }

  const uiListener = {
    observe() { updatePopupIcon(); },
    handleEvent() { updatePopupIcon(); }
  };

  function init() {
    Services.prefs.addObserver("dom.disable_open_during_load", uiListener);
    window.gBrowser.tabContainer.addEventListener("TabSelect", uiListener);
    window.addEventListener("AlertActive", uiListener);
    window.addEventListener("AlertClose", uiListener);
    window.addEventListener("DOMUpdateBlockedPopups", uiListener, true);

    const deck = document.getElementById("tab-notification-deck");
    if (deck) {
      new MutationObserver(updatePopupIcon).observe(deck, { childList: true, subtree: true });
    }

    // Attach click/context handlers for popup options and preferences navigation.
    let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
    targets.forEach(el => {
      el.addEventListener("click", handleIconClick, true);
      el.addEventListener("contextmenu", handleIconContextMenu, true);
    });
    
    updatePopupIcon();
  }

  let checkInterval = setInterval(() => {
    if (document.querySelector(STATUS_ICON_SELECTOR)) {
      clearInterval(checkInterval);
      init();
    }
  }, 100);

  window.addEventListener("unload", () => {
    clearInterval(checkInterval);
    Services.prefs.removeObserver("dom.disable_open_during_load", uiListener);
    window.gBrowser.tabContainer.removeEventListener("TabSelect", uiListener);
    window.removeEventListener("AlertActive", uiListener);
    window.removeEventListener("AlertClose", uiListener);
    window.removeEventListener("DOMUpdateBlockedPopups", uiListener, true);
    
    let targets = document.querySelectorAll(STATUS_ICON_SELECTOR);
    targets.forEach(el => {
      el.removeEventListener("click", handleIconClick, true);
      el.removeEventListener("contextmenu", handleIconContextMenu, true);
    });
  }, { once: true });
})();