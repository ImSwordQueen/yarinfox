// IE7&8 Menu Context Menus for rinfox
// Unoptimized/copy pasted code
// About IE will point to rinFox site when it is completed (Not going to happen.)

/* // Print Menu (Unmovable and kinda useless when it uses the same things as firefox)
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");
  if (!tabsToolbar) return;

  const printToolbarButton = createElement("toolbarbutton", {
    id: "newprint-button",
    class: "print",
    removable: "false",
    "cui-areatype": "toolbar"
  });

  const printPopup = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");

  const printMenuItems = [
    { label: "Print", class: "print-item1", action: () => PrintUtils.startPrintWindow(gBrowser.selectedBrowser.browsingContext) },
    { label: "Print Preview...", class: "print-item2", action: () => PrintUtils.togglePrintPreview(gBrowser.selectedBrowser.browsingContext) },
    { label: "Page Setup...", class: "print-item3", action: () => PrintUtils.showPageSetup() },
  ];

  printMenuItems.forEach((item, index) => {
    const printMenuItem = createElement("menuitem", { label: item.label, class: item.class });
    
    printMenuItem.addEventListener("command", item.action);
    printPopup.appendChild(printMenuItem);
    
    if (index === 1) {
      printPopup.appendChild(createElement("menuseparator", { orient: "horizontal" }));
    }
  });

  printToolbarButton.appendChild(printPopup);
  printToolbarButton.addEventListener("click", () => {
    printPopup.openPopup(printToolbarButton, "after_start", 0, 0, true, false);
  });

  tabsToolbar.appendChild(printToolbarButton);

  function createElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }
}); */

// Page Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");
  if (!tabsToolbar) return;

  const toolbarButton = createElement("toolbarbutton", {
    id: "pagemenu-button",
    class: "pagemenu",
    removable: "false",
    "cui-areatype": "toolbar"
  });

  const labelElement = createElement("label", { value: "Page" });
  const popup = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");

  const menuItems = [
    { label: "New Window", class: "item1", action: () => OpenBrowserWindow() },
    { label: "Cut", class: "item2", action: () => goDoCommand('cmd_cut') },
    { label: "Copy", class: "item3", action: () => goDoCommand('cmd_copy') },
    { label: "Paste", class: "item4", action: () => goDoCommand('cmd_paste') },
    { label: "Save As...", class: "item5", action: () => saveBrowser(gBrowser.selectedBrowser) },
    { label: "Send Page by E-mail...", class: "item6", action: () => MailIntegration.sendLinkForBrowser(gBrowser.selectedBrowser) },
    { label: "Picture in Picture", class: "item7", action: (event) => {
      PictureInPicture.onCommand(event);
      readFromClipboard();
    }},
    { label: "Find in Page", class: "item8", action: () => gLazyFindCommand('onFindCommand') },
    { label: "Zoom", class: "item9", classType: "menu" }, // Special case for Zoom
    { label: "Style", class: "item10", submenu: true }, // Submenu
    { label: "Work Offline", class: "item11", action: () => BrowserOffline.toggleOfflineStatus() },
    { label: "Caret Browsing", class: "item12", action: () => gBrowser.toggleCaretBrowsing() },
    { label: "Properties", class: "item13", action: () => BrowserPageInfo() },
    { label: "View Source", class: "item14", action: () => BrowserViewSource(window.gBrowser.selectedBrowser) },
  ];

  menuItems.forEach((item, index) => {
    const menuItem = createElement(item.classType || "menuitem", { label: item.label, class: item.class });
    
    if (item.action) {
      menuItem.addEventListener("command", item.action);
    }
    
    if (item.class === "item9") {
      menuItem.appendChild(createZoomSubmenu());
    }
    
    if (item.class === "item10" && item.submenu) {
      menuItem.appendChild(createStyleSubmenu());
    }

    if ([1, 4, 8, 11].includes(index)) {
      popup.appendChild(createElement("menuseparator", { orient: "horizontal" }));
    }

    popup.appendChild(menuItem);
  });

  toolbarButton.appendChild(popup);
  toolbarButton.addEventListener("click", () => popup.openPopup(toolbarButton, "after_start", 0, 0, true, false));
  toolbarButton.appendChild(labelElement);
  
  tabsToolbar.appendChild(toolbarButton);

  function createElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function createZoomSubmenu() {
    const submenu = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");
    const zoomItems = [
      { label: "Zoom In", class: "subitem1", action: () => FullZoom.enlarge() },
      { label: "Zoom Out", class: "subitem2", action: () => FullZoom.reduce() },
      { separator: true },
      { label: "400%", class: "subitem3" },
      { label: "200%", class: "subitem4" },
      { label: "150%", class: "subitem5" },
      { label: "125%", class: "subitem6" },
      { label: "100%", class: "subitem7" },
      { label: "75%", class: "subitem8" },
      { label: "50%", class: "subitem9" },
      { separator: true },
      { label: "Reset Zoom", class: "subitem10", action: () => {
        FullZoom.reset();
      }},
    ];

    zoomItems.forEach(item => {
      if (item.separator) {
        submenu.appendChild(createElement("menuseparator", { orient: "horizontal" }));
      } else {
        const zoomMenuItem = createElement("menuitem", { label: item.label, class: item.class });
        zoomMenuItem.addEventListener("command", item.action || (() => {
          const zoomFactor = parseInt(item.label) || 100; 
          FullZoom.setZoom(zoomFactor);
        }));
        submenu.appendChild(zoomMenuItem);
      }
    });

    return submenu;
  }

  function createStyleSubmenu() {
    const submenu = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");
    const styleItems = [
      { label: "No Style", class: "subitem11", action: () => gPageStyleMenu.disableStyle() },
      { label: "Basic Page Style", class: "subitem12", action: () => gPageStyleMenu.switchStyleSheet(null) },
    ];
    
    styleItems.forEach(item => {
      const styleMenuItem = createElement("menuitem", { label: item.label, class: item.class });
      styleMenuItem.addEventListener("command", item.action);
      submenu.appendChild(styleMenuItem);
    });

    return submenu;
  }
});

// Safety Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");
  if (!tabsToolbar) return;

  const safetyToolbarButton = createElement("toolbarbutton", {
    id: "safety-button",
    class: "safety",
    removable: "false",
    "cui-areatype": "toolbar"
  });

  const safetyLabelElement = createElement("label", { value: "Safety" });
  const safetyPopup = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");

  const safetyMenuItems = [
    { label: "Delete Browsing History...", class: "safety-item1", action: () => {
      PlacesCommandHook.showPlacesOrganizer('History');
      CustomizableUI.hidePanelForNode(this);
    }},
    { label: "InPrivate Browsing", class: "safety-item2", action: () => OpenBrowserWindow({private: true}) },
    { label: "Troubleshooting...", class: "safety-item3", action: openTroubleshootingPage },
    { label: "Mute This Tab", class: "safety-item4", action: () => gBrowser.toggleMuteAudioOnMultiSelectedTabs(gBrowser.selectedTab) },
    { label: "Report Unsafe Website", class: "safety-item5", action: (event) => {
      openUILink(gSafeBrowsing.getReportURL('Phish'), event, {triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({})});
    }}
  ];

  safetyMenuItems.forEach((item, index) => {
    const safetyMenuItem = createElement("menuitem", { label: item.label, class: item.class });
    safetyMenuItem.addEventListener("command", item.action);
    safetyPopup.appendChild(safetyMenuItem);

    if (index === 2) {
      safetyPopup.appendChild(createElement("menuseparator", { orient: "horizontal" }));
    }
  });

  safetyToolbarButton.appendChild(safetyPopup);
  safetyToolbarButton.appendChild(safetyLabelElement);
  safetyToolbarButton.addEventListener("click", () => {
    safetyPopup.openPopup(safetyToolbarButton, "after_start", 0, 0, true, false);
  });

  tabsToolbar.appendChild(safetyToolbarButton);

  function createElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }
});

// Tools Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (!tabsToolbar) return;

  const toolsToolbar = createElement("toolbar", {
    id: "tools-toolbar",
    customizable: "true",
    defaultset: "spring"
  });

  const toolsButton = createElement("toolbarbutton", {
    id: "tools-button",
    class: "tools-menu",
    removable: "false",
    "cui-areatype": "toolbar"
  });

  const toolsLabel = createElement("label", { value: "Tools" });
  const toolsPopup = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");

  const toolsItems = [
    { label: "Diagnose Connection Problems...", class: "tools-item1", action: safeModeRestart },
    { label: "Reopen Last Browsing Session", class: "tools-item2", action: SessionStore.restoreLastSession },
    { label: "Pop-up Blocker", class: "tools-item3", submenu: true, separator: true },
    { label: "Manage Add-ons", class: "tools-item4", action: () => gUnifiedExtensions.togglePanel() },
    { label: "Reader View", class: "tools-item5", action: () => AboutReaderParent.toggleReaderMode() },
    { label: "Full Screen", class: "tools-item6", action: BrowserFullScreen },
    { label: "Toolbars", class: "tools-item7", submenu: true },
    { label: "Explorer Bars", class: "tools-item8", submenu: true },
    { label: "Task Manager", class: "tools-item9", action: () => switchToTabHavingURI('about:processes', true) },
    { label: "Internet Options", class: "tools-item10", action: openPreferences }
  ];

  toolsItems.forEach((item, index) => {
    const toolsItem = createElement(item.submenu ? "menu" : "menuitem", {
      label: item.label,
      class: item.class
    });

    if (item.separator) {
      toolsPopup.appendChild(createElement("menuseparator", { orient: "horizontal" }));
    }

    if (item.submenu) {
      const submenu = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menupopup");
      configureSubmenu(item.class, submenu);
      toolsItem.appendChild(submenu);
    }

    toolsItem.addEventListener("command", item.action || (() => {}));
    toolsPopup.appendChild(toolsItem);
  });

  toolsButton.appendChild(toolsPopup);
  toolsButton.appendChild(toolsLabel);
  toolsButton.addEventListener("click", () => {
    toolsPopup.openPopup(toolsButton, "after_start", 0, 0, true, false);
  });

  toolsToolbar.appendChild(toolsButton);
  tabsToolbar.appendChild(toolsToolbar);

  function createElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function configureSubmenu(className, submenu) {
    const subItems = {
      "tools-item3": [
        { label: "Turn off Pop-up Blocker", class: "tools-subitem1", action: () => gBrowser.selectedBrowser.popupBlocker.unblockAllPopups() },
        { label: "Pop-up Blocker Settings", class: "tools-subitem2", action: () => openPreferences("privacy-permissions-block-popups") }
      ],
      "tools-item7": [
        { label: "Menu Bar", class: "tools-subitem3", action: toggleMenuBar },
        { label: "Favorites Bar", class: "tools-subitem4", action: () => SidebarUI.toggle('viewBookmarksSidebar') },
        { label: "Command Bar", class: "tools-subitem5", action: () => BookmarkingUI.toggleBookmarksToolbar('shortcut') },
        { label: "Customize Toolbar...", class: "tools-subitem6", action: () => gCustomizeMode.enter() }
      ],
      "tools-item8": [
        { label: "Favorites", class: "tools-subitem7", action: () => SidebarUI.toggle('viewBookmarksSidebar') },
        { label: "History", class: "tools-subitem8", action: () => PlacesCommandHook.showPlacesOrganizer('History') }
      ]
    };

      if (subItems[className]) {
        subItems[className].forEach(subItem => {
          const item = createElement("menuitem", { label: subItem.label, class: subItem.class });
          item.addEventListener("command", subItem.action);
          submenu.appendChild(item);
        });
      }
    }

    function toggleMenuBar() {
      const menuBar = document.getElementById("toolbar-menubar");
      if (menuBar) {
        const isAutoHide = menuBar.getAttribute("autohide") === "true";
        menuBar.setAttribute("autohide", !isAutoHide);
      }
    }
});

// Help Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (!tabsToolbar) return;

  const hpToolbarButton = createElement("toolbarbutton", {
    id: "hp-button",
    class: "hp",
    removable: "false",
    "cui-areatype": "toolbar"
  });

  const hpPopup = createElement("menupopup");

  const hpMenuItems = [
    { label: "Internet Explorer Help", class: "hp-item1", action: () => openHelpLink('firefox-help') },
    { label: "What's New in Internet Explorer", class: "hp-item2", action: openSpecificLink },
    { label: "Online Support", class: "hp-item3", action: () => openTab("https://web.archive.org/web/20100901073034id_/http://support.microsoft.com/default.aspx") },
    { label: "About Internet Explorer", class: "hp-item4", action: openAboutDialog }
  ];

  hpMenuItems.forEach((item, index) => {
    const hpMenuItem = createElement("menuitem", { label: item.label, class: item.class });
    hpMenuItem.addEventListener("command", item.action);
    
    hpPopup.appendChild(hpMenuItem);

    if (index === 0 || index === 2) {
      hpPopup.appendChild(createElement("menuseparator", { orient: "horizontal" }));
    }
  });

  hpToolbarButton.appendChild(hpPopup);
  
  hpToolbarButton.addEventListener("click", () => {
    hpPopup.openPopup(hpToolbarButton, "after_start", 0, 0, true, false);
  });

  tabsToolbar.appendChild(hpToolbarButton);

  function openSpecificLink() {
    const newURL = Services.prefs.getBoolPref("RinFox.Appearance.IE8")
      ? "https://web.archive.org/web/20110322221930id_/http://windows.microsoft.com/en-US/internet-explorer/products/ie-8/welcome"
      : "https://web.archive.org/web/20090101033733id_/http://www.microsoft.com/windows/ie/ie7/tour/fre/default.mspx";
    
    openTab(newURL);
  }

  function openTab(url) {
    const newTab = window.gBrowser.addTrustedTab(url);
    window.gBrowser.selectedTab = newTab;
  }

  function createElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }
});