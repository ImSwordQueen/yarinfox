(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const TARGET_PANEL_SELECTOR = "#addonbar .separator-5";
  const SHIELD_CONTAINER_ID = "tracking-protection-icon-container";

  // Firefox 140 localizes the shield via data-l10n-id instead of writing the
  // final aria-label synchronously. Keep the old text fallback for branded 115
  // profiles, but prefer the stable localization IDs where available.
  const TARGET_L10N_IDS = new Set([
    "tracking-protection-icon-active-container",
    "tracking-protection-icon-no-trackers-detected-container"
  ]);

  const TARGET_LABELS = new Set([
    "No trackers known to Internet Explorer were detected on this page.",
    "No trackers known to Firefox were detected on this page.",
    "Blocking social media trackers, cross-site tracking cookies, and fingerprinters."
  ]);

  function isTargetShieldState(shieldContainer) {
    let l10nId = shieldContainer.getAttribute("data-l10n-id") || "";
    if (TARGET_L10N_IDS.has(l10nId)) {
      return true;
    }

    let currentLabel = shieldContainer.getAttribute("aria-label") || "";
    return TARGET_LABELS.has(currentLabel);
  }

  function handleShieldEvent(e) {
    if (
      (e.type == "click" && e.button != 0) ||
      (e.type == "keypress" && e.charCode != KeyEvent.DOM_VK_SPACE && e.keyCode != KeyEvent.DOM_VK_RETURN)
    ) {
      return;
    }

    if (typeof gProtectionsHandler?.handleProtectionsButtonEvent == "function") {
      gProtectionsHandler.handleProtectionsButtonEvent(e);
    } else if (typeof gProtectionsHandler?.showProtectionsPopup == "function") {
      e.stopPropagation();
      gProtectionsHandler.showProtectionsPopup({ event: e, openingReason: "shieldButtonClicked" });
    }
  }

  function prefetchProtectionsPanel() {
    gProtectionsHandler?.onTrackingProtectionIconHoveredOrFocused?.();
  }

  function evaluatePanelContextMenu(e) {
    // TARGET CHECK: If the click didn't happen inside .separator-5 or the tracking container,
    // bail out immediately and let other elements handle their own context menus!
    if (!e.target.closest(TARGET_PANEL_SELECTOR) && !e.target.closest("#" + SHIELD_CONTAINER_ID)) {
      return;
    }

    let shieldContainer = document.getElementById(SHIELD_CONTAINER_ID);
    if (!shieldContainer) return;

    let shouldKillMenu = isTargetShieldState(shieldContainer);

    if (shouldKillMenu) {
      // The labels match: kill the right-click menu instantly right here
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function transplantShieldContainer() {
    try {
      let targetPanel = document.querySelector(TARGET_PANEL_SELECTOR);
      let shieldContainer = document.getElementById(SHIELD_CONTAINER_ID);

      if (!targetPanel || !shieldContainer) return;

      // Physically shift the container node into .separator-5
      targetPanel.appendChild(shieldContainer);

      // Force target elements to route right-clicks through our visibility validator check.
      // Setting 'true' forces execution during the capture phase, intercepting it before the browser triggers the context menu.
      targetPanel.addEventListener("contextmenu", evaluatePanelContextMenu, true);
      shieldContainer.addEventListener("contextmenu", evaluatePanelContextMenu, true);
      shieldContainer.addEventListener("click", handleShieldEvent, true);
      shieldContainer.addEventListener("keypress", handleShieldEvent, true);
      shieldContainer.addEventListener("mouseover", prefetchProtectionsPanel);
      shieldContainer.addEventListener("focus", prefetchProtectionsPanel);

      // Explicitly wipe the native context attributes off the container to prevent fallback menus
      shieldContainer.removeAttribute("context");
      shieldContainer.removeAttribute("contextmenu");

    } catch (e) {}
  }

  // Poll until both layout elements are fully rendered in the DOM map
  let transplantInterval = setInterval(() => {
    if (document.querySelector(TARGET_PANEL_SELECTOR) && document.getElementById(SHIELD_CONTAINER_ID)) {
      clearInterval(transplantInterval);
      transplantShieldContainer();
    }
  }, 50);

  window.addEventListener("unload", () => {
    clearInterval(transplantInterval);
  }, { once: true });

})();