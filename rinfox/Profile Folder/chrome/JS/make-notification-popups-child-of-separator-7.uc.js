(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const TARGET_PANEL_SELECTOR = "#addonbar .separator-7";
  const NOTIFICATION_BOX_ID = "notification-popup-box";

  function evaluateNotificationContextMenu(e) {
    let notificationBox = document.getElementById(NOTIFICATION_BOX_ID);
    if (!notificationBox) return;

    // TARGET CHECK: Only intercept if the click actually happened inside .separator-7
    if (!e.target.closest(TARGET_PANEL_SELECTOR)) return;

    // Check if the container is explicitly hidden by Firefox
    let isHidden = notificationBox.hasAttribute("hidden") || notificationBox.getAttribute("showing") === "false";

    // Find any actual, visible inner sub-notification anchor icons
    let hasVisibleIcons = Array.from(notificationBox.querySelectorAll(".notification-anchor-icon"))
                               .some(img => img.getBoundingClientRect().width > 0 || img.hasAttribute("showing"));

    // If it's not hidden AND there is a real icon present, block the menu!
    if (!isHidden && hasVisibleIcons) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function transplantNotificationBox() {
    try {
      let targetPanel = document.querySelector(TARGET_PANEL_SELECTOR);
      let notificationBox = document.getElementById(NOTIFICATION_BOX_ID);

      if (!targetPanel || !notificationBox) return;

      // Physically shift the notification panel box into .separator-7
      targetPanel.appendChild(notificationBox);

      // Force target elements to route right-clicks through our visibility validator check.
      targetPanel.addEventListener("contextmenu", evaluateNotificationContextMenu, true);
      notificationBox.addEventListener("contextmenu", evaluateNotificationContextMenu, true);

      // Explicitly wipe the native context attributes off the container to prevent fallback menus
      notificationBox.removeAttribute("context");
      notificationBox.removeAttribute("contextmenu");

    } catch (e) {}
  }

  // Poll until both layout elements are fully rendered in the DOM tree map
  let transplantInterval = setInterval(() => {
    if (document.querySelector(TARGET_PANEL_SELECTOR) && document.getElementById(NOTIFICATION_BOX_ID)) {
      clearInterval(transplantInterval);
      transplantNotificationBox();
    }
  }, 50);

  window.addEventListener("unload", () => {
    clearInterval(transplantInterval);
  }, { once: true });

})();