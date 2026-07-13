(function() {
  if (location != "chrome://browser/content/browser.xhtml") return;

  const TARGET_PANEL_SELECTOR = "#addonbar .separator-6";
  const PERMISSION_BOX_ID = "identity-permission-box";

  function evaluatePermissionContextMenu(e) {
    // TARGET CHECK: If the click didn't happen inside .separator-6 or the box itself,
    // bail out immediately and let other separators handle their own context menus!
    if (!e.target.closest(TARGET_PANEL_SELECTOR) && !e.target.closest("#" + PERMISSION_BOX_ID)) {
      return;
    }

    let permissionBox = document.getElementById(PERMISSION_BOX_ID);
    if (!permissionBox) return;

    // Check if the container is explicitly hidden by Firefox
    let isHidden = permissionBox.hasAttribute("hidden") || permissionBox.getAttribute("showing") === "false";

    // Find any actual, visible inner sub-permission icons (microphone, camera, location, etc.)
    let hasVisibleIcons = Array.from(permissionBox.querySelectorAll(".sharing-icon, .permission-popup-permission-icon, image"))
                               .some(img => img.getBoundingClientRect().width > 0 || img.hasAttribute("showing"));

    // If it's not hidden AND there is a real active permission icon present, block the menu!
    if (!isHidden && hasVisibleIcons) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function handlePermissionCommand(e) {
    if (typeof gPermissionPanel == "undefined") return;

    gPermissionPanel.handleIdentityButtonEvent(e);

    if (e.type == "click" && typeof PageProxyClickHandler == "function") {
      PageProxyClickHandler(e);
    }
  }

  function transplantPermissionBox() {
    try {
      let targetPanel = document.querySelector(TARGET_PANEL_SELECTOR);
      let permissionBox = document.getElementById(PERMISSION_BOX_ID);

      if (!targetPanel || !permissionBox) return;

      // Physically shift the permissions container into .separator-6
      targetPanel.appendChild(permissionBox);

      // Force target elements to route right-clicks through our visibility validator check.
      // Setting 'true' forces execution during the capture phase, intercepting it before the browser triggers the context menu.
      targetPanel.addEventListener("contextmenu", evaluatePermissionContextMenu, true);
      permissionBox.addEventListener("contextmenu", evaluatePermissionContextMenu, true);

      // Firefox 140 routes permission-box activation through navigator-toolbox
      // delegation. Once moved to the statusbar, keep the same native command
      // path wired directly on the relocated node.
      permissionBox.addEventListener("click", handlePermissionCommand);
      permissionBox.addEventListener("keypress", handlePermissionCommand);

      // Explicitly wipe the native context attributes off the container to prevent fallback menus
      permissionBox.removeAttribute("context");
      permissionBox.removeAttribute("contextmenu");

    } catch (e) {}
  }

  // Poll until both layout elements are fully rendered in the DOM map
  let transplantInterval = setInterval(() => {
    if (document.querySelector(TARGET_PANEL_SELECTOR) && document.getElementById(PERMISSION_BOX_ID)) {
      clearInterval(transplantInterval);
      transplantPermissionBox();
    }
  }, 50);

  window.addEventListener("unload", () => {
    clearInterval(transplantInterval);
  }, { once: true });

})();