// IE7&8 Menu Context Menus for rinfox
// Unoptimized/copy pasted code
// About IE will point to rinFox site when it is completed


// Print Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (tabsToolbar) {
    const printToolbarbutton = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbarbutton"
    );

    printToolbarbutton.setAttribute("id", "newprint-button");
    printToolbarbutton.setAttribute("class", "print");
    printToolbarbutton.setAttribute("removable", "false");
    printToolbarbutton.setAttribute("cui-areatype", "toolbar");

    const printPopup = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menupopup"
    );

    const printMenuItems = [
      { label: "Print", class: "print-item1" },
      { label: "Print Preview...", class: "print-item2" },
      { label: "Page Setup...", class: "print-item3" }
    ];

    for (let i = 0; i < printMenuItems.length; i++) {
      const printMenuItem = document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        "menuitem"
      );

      printMenuItem.setAttribute("label", printMenuItems[i].label);
      printMenuItem.setAttribute("class", printMenuItems[i].class);

      printPopup.appendChild(printMenuItem);

      if (i === 1) {
        const separator = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menuseparator"
        );
        separator.setAttribute("orient", "horizontal");
        printPopup.appendChild(separator);
      }
    }

    printToolbarbutton.appendChild(printPopup);

    printToolbarbutton.addEventListener("click", function () {
      printPopup.openPopup(printToolbarbutton, "after_start", 0, 0, true, false);
    });

    tabsToolbar.appendChild(printToolbarbutton);
  }
  
  // Print context menu functions
  const printitem1 = document.querySelector(".print-item1");
  const printitem2 = document.querySelector(".print-item2");
  const printitem3 = document.querySelector(".print-item3");  
  
if (printitem1) {
  const openGoogleSearch = function (event) {
    PrintUtils.startPrintWindow(gBrowser.selectedBrowser.browsingContext);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  printitem1.addEventListener("command", openGoogleSearch);
}

if (printitem2) {
  const openGoogleSearch = function (event) {
    PrintUtils.togglePrintPreview(gBrowser.selectedBrowser.browsingContext);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  printitem2.addEventListener("command", openGoogleSearch);
}

if (printitem3) {
  const openGoogleSearch = function (event) {
    PrintUtils.showPageSetup();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  printitem3.addEventListener("command", openGoogleSearch);
}  
});


// Page Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (tabsToolbar) {
    const toolbarbutton = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbarbutton"
    );

    toolbarbutton.setAttribute("id", "pagemenu-button");
    toolbarbutton.setAttribute("class", "pagemenu");
    toolbarbutton.setAttribute("removable", "false");
    toolbarbutton.setAttribute("cui-areatype", "toolbar");

    const labelElement = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "label"
    );
    labelElement.setAttribute("value", "Page");

    const popup = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menupopup"
    );

    const menuItems = [
      { label: "New Window ", class: "item1" },
      { label: "Cut", class: "item2" },
      { label: "Copy", class: "item3" },
      { label: "Paste", class: "item4" },
      { label: "Save As...", class: "item5" },
      { label: "Send Page by E-mail...", class: "item6" },
      { label: "Picture in Picture", class: "item7" },
      { label: "Find in Page", class: "item8" },
      { label: "Zoom", class: "item9" },
      { label: "Style", class: "item10", submenu: true }, // "Item 10" with a submenu
      { label: "Work Offline", class: "item11" },
      { label: "Caret Browsing", class: "item12" },
      { label: "Properties", class: "item13" },
      { label: "View Source", class: "item14" },
    ];

    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        menuItems[i].class === "item9" || menuItems[i].class === "item10" ? "menu" : "menuitem"
      );

      menuItem.setAttribute("label", menuItems[i].label);
      menuItem.setAttribute("class", menuItems[i].class);

      if (i === 1 || i === 4 || i === 8 || i === 11) {
        const separator = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menuseparator"
        );
        separator.setAttribute("orient", "horizontal");
        popup.appendChild(separator);
      }

      if (menuItems[i].class === "item9") {
        const submenu = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menupopup"
        );

        const subItems = [
          { label: "Zoom In", class: "subitem1" },
          { label: "Zoom Out", class: "subitem2" },
          { separator: true },
          { label: "400%", class: "subitem3" },
          { label: "200%", class: "subitem4" },
          { label: "150%", class: "subitem5" },
          { label: "125%", class: "subitem6" },
          { label: "100%", class: "subitem7" },
          { label: "75%", class: "subitem8" },
          { label: "50%", class: "subitem9" },
          { separator: true },
          { label: "Reset Zoom", class: "subitem10" },
        ];

        for (let j = 0; j < subItems.length; j++) {
          if (subItems[j].separator) {
            const separator = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuseparator"
            );
            separator.setAttribute("orient", "horizontal");
            submenu.appendChild(separator);
          } else {
            const subItem = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuitem"
            );
            subItem.setAttribute("label", subItems[j].label);
            subItem.setAttribute("class", subItems[j].class);
            submenu.appendChild(subItem);
          }
        }

        menuItem.appendChild(submenu);
      }

      if (menuItems[i].class === "item10" && menuItems[i].submenu) {
        const submenu = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menupopup"
        );

        const subItems = [
          { label: "No Style", class: "subitem11" },
          { label: "Basic Page Style", class: "subitem12" },
        ];

        for (let j = 0; j < subItems.length; j++) {
          if (subItems[j].separator) {
            const separator = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuseparator"
            );
            separator.setAttribute("orient", "horizontal");
            submenu.appendChild(separator);
          } else {
            const subItem = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuitem"
            );
            subItem.setAttribute("label", subItems[j].label);
            subItem.setAttribute("class", subItems[j].class);
            submenu.appendChild(subItem);
          }
        }

        menuItem.appendChild(submenu);
      }

      popup.appendChild(menuItem);
    }

    toolbarbutton.appendChild(popup);

    toolbarbutton.addEventListener("click", function () {
      popup.openPopup(toolbarbutton, "after_start", 0, 0, true, false);
    });

    toolbarbutton.appendChild(labelElement);

    tabsToolbar.appendChild(toolbarbutton);
  }
   
  // Page Menu Items functions
  const item1 = document.querySelector(".item1");
  const item2 = document.querySelector(".item2");
  const item3 = document.querySelector(".item3");
  const item4 = document.querySelector(".item4");
  const item5 = document.querySelector(".item5");
  const item6 = document.querySelector(".item6");
  const item7 = document.querySelector(".item7");
  const item8 = document.querySelector(".item8");
  const item9 = document.querySelector(".item9");
  const item10 = document.querySelector(".item10");
  const item11 = document.querySelector(".item11");
  const item12 = document.querySelector(".item12");
  const item13 = document.querySelector(".item13");
  const item14 = document.querySelector(".item14");
  
  const subitem1 = document.querySelector(".subitem1");
  const subitem2 = document.querySelector(".subitem2");
  const subitem3 = document.querySelector(".subitem3");
  const subitem4 = document.querySelector(".subitem4");
  const subitem5 = document.querySelector(".subitem5");
  const subitem6 = document.querySelector(".subitem6");
  const subitem7 = document.querySelector(".subitem7");
  const subitem8 = document.querySelector(".subitem8");
  const subitem9 = document.querySelector(".subitem9");
  const subitem10 = document.querySelector(".subitem10");
  const subitem11 = document.querySelector(".subitem11");
  const subitem12 = document.querySelector(".subitem12");
  const subitem13 = document.querySelector(".subitem13");
  const subitem14 = document.querySelector(".subitem14");
  const subitem15 = document.querySelector(".subitem15");
  
  

if (item1) {
  const openBrowserOnce = function (event) {
    if (event.target === item1) {
      OpenBrowserWindow();

      item1.removeEventListener("command", openBrowserOnce);
    }
  };

  item1.addEventListener("command", openBrowserOnce);
}


if (item2) {
  const openGoogleSearch = function (event) {
    goDoCommand('cmd_cut');

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item2.addEventListener("command", openGoogleSearch);
}

if (item3) {
  const openGoogleSearch = function (event) {
    goDoCommand('cmd_copy');

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item3.addEventListener("command", openGoogleSearch);
}


if (item4) {
  const openGoogleSearch = function (event) {
    goDoCommand('cmd_paste');

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item4.addEventListener("command", openGoogleSearch);
}


if (item5) {
  const openGoogleSearch = function (event) {
    saveBrowser(gBrowser.selectedBrowser);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item5.addEventListener("command", openGoogleSearch);
}

if (item6) {
  const openGoogleSearch = function (event) {
    MailIntegration.sendLinkForBrowser(gBrowser.selectedBrowser);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item6.addEventListener("command", openGoogleSearch);
}

if (item7) {
  const openGoogleSearch = function (event) {
    PictureInPicture.onCommand(event);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item7.addEventListener("command", openGoogleSearch);
}

if (item8) {
  const openGoogleSearch = function (event) {
    gLazyFindCommand('onFindCommand');

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item8.addEventListener("command", openGoogleSearch);
}

if (subitem1) {
  const openGoogleSearch = function (event) {
    FullZoom.enlarge();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  subitem1.addEventListener("command", openGoogleSearch);
}


if (subitem2) {
  const openGoogleSearch = function (event) {
    FullZoom.reduce();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  subitem2.addEventListener("command", openGoogleSearch);
}



if (subitem3) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.enlarge(), 0);
    setTimeout(() => FullZoom.enlarge(), 1);
    setTimeout(() => FullZoom.enlarge(), 2);
	setTimeout(() => FullZoom.enlarge(), 3);
  };

  subitem3.addEventListener("command", executeMultipleFunctions);
}

if (subitem4) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.enlarge(), 0);
    setTimeout(() => FullZoom.enlarge(), 1);
    setTimeout(() => FullZoom.enlarge(), 2);
  };

  subitem4.addEventListener("command", executeMultipleFunctions);
}

if (subitem5) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.enlarge(), 0);
    setTimeout(() => FullZoom.enlarge(), 1);
  };

  subitem5.addEventListener("command", executeMultipleFunctions);
}


if (subitem6) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.enlarge(), 0);
  };

  subitem6.addEventListener("command", executeMultipleFunctions);
}



if (subitem7) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();
  };

  subitem7.addEventListener("command", executeMultipleFunctions);
}


if (subitem8) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.reduce(), 0);
  };

  subitem8.addEventListener("command", executeMultipleFunctions);
}


if (subitem9) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();

    setTimeout(() => FullZoom.reduce(), 0);
	setTimeout(() => FullZoom.reduce(), 1);
	
  };

  subitem9.addEventListener("command", executeMultipleFunctions);
}


if (subitem10) {
  const executeMultipleFunctions = function (event) {
    FullZoom.reset();
  };

  subitem10.addEventListener("command", executeMultipleFunctions);
}



if (subitem11) {
  const openGoogleSearch = function (event) {
    gPageStyleMenu.disableStyle();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  subitem11.addEventListener("command", openGoogleSearch);
}

if (subitem12) {
  const openGoogleSearch = function (event) {
   gPageStyleMenu.switchStyleSheet(null);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  subitem12.addEventListener("command", openGoogleSearch);
}


if (item11) {
  const openGoogleSearch = function (event) {
   BrowserOffline.toggleOfflineStatus();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item11.addEventListener("command", openGoogleSearch);
}



if (item12) {
  const openGoogleSearch = function (event) {
   gBrowser.toggleCaretBrowsing();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item12.addEventListener("command", openGoogleSearch);
}

if (item13) {
  const openGoogleSearch = function (event) {
   BrowserPageInfo();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item13.addEventListener("command", openGoogleSearch);
}


if (item14) {
  const openGoogleSearch = function (event) {
   BrowserViewSource(window.gBrowser.selectedBrowser);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  item14.addEventListener("command", openGoogleSearch);
}
});


// Safety Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (tabsToolbar) {
    const safetyToolbarbutton = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbarbutton"
    );

    safetyToolbarbutton.setAttribute("id", "safety-button");
    safetyToolbarbutton.setAttribute("class", "safety");
    safetyToolbarbutton.setAttribute("removable", "false");
    safetyToolbarbutton.setAttribute("cui-areatype", "toolbar");

    const safetyLabelElement = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "label"
    );
    safetyLabelElement.setAttribute("value", "Safety");

    const safetyPopup = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menupopup"
    );

    const safetyMenuItems = [
      { label: "Delete Browsing History...", class: "safety-item1" },
      { label: "InPrivate Browsing", class: "safety-item2" },
      { label: "Troubleshooting...", class: "safety-item3" },
      { label: "Mute This Tab", class: "safety-item4" },
      { label: "Report Unsafe Website", class: "safety-item5" }
    ];

    for (let i = 0; i < safetyMenuItems.length; i++) {
      const safetyMenuItem = document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        "menuitem"
      );

      safetyMenuItem.setAttribute("label", safetyMenuItems[i].label);
      safetyMenuItem.setAttribute("class", safetyMenuItems[i].class);

      safetyPopup.appendChild(safetyMenuItem);

      if (i === 2) {
        const separator = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menuseparator"
        );
        separator.setAttribute("orient", "horizontal");
        safetyPopup.appendChild(separator);
      }
    }

    safetyToolbarbutton.appendChild(safetyPopup);

    safetyToolbarbutton.addEventListener("click", function () {
      safetyPopup.openPopup(safetyToolbarbutton, "after_start", 0, 0, true, false);
    });

    safetyToolbarbutton.appendChild(safetyLabelElement);

    tabsToolbar.appendChild(safetyToolbarbutton);
  }
  
  
  
  // Safety Menu Items functions
  const safetyitem1 = document.querySelector(".safety-item1");
  const safetyitem2 = document.querySelector(".safety-item2");
  const safetyitem3 = document.querySelector(".safety-item3");
  const safetyitem4 = document.querySelector(".safety-item4");
  const safetyitem5 = document.querySelector(".safety-item5");
  

if (safetyitem1) {
  const openGoogleSearch = function (event) {
   PlacesCommandHook.showPlacesOrganizer('History'); CustomizableUI.hidePanelForNode(this);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  safetyitem1.addEventListener("command", openGoogleSearch);
}

if (safetyitem2) {
  const openGoogleSearch = function (event) {
   OpenBrowserWindow({private: true});

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  safetyitem2.addEventListener("command", openGoogleSearch);
}


if (safetyitem3) {
  const openGoogleSearch = function (event) {
   openTroubleshootingPage();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  safetyitem3.addEventListener("command", openGoogleSearch);
}

if (safetyitem4) {
  const openGoogleSearch = function (event) {
   gBrowser.toggleMuteAudioOnMultiSelectedTabs(gBrowser.selectedTab);

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  safetyitem4.addEventListener("command", openGoogleSearch);
}


if (safetyitem5) {
  const openGoogleSearch = function (event) {
   openUILink(gSafeBrowsing.getReportURL('Phish'), event, {triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({})});

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  safetyitem5.addEventListener("command", openGoogleSearch);
}
  
});

// Tools Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (tabsToolbar) {
    const toolsToolbar = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbar"
    );
    toolsToolbar.setAttribute("id", "tools-toolbar");
    toolsToolbar.setAttribute("customizable", "true");

    toolsToolbar.setAttribute("defaultset", "spring");

    const toolsButton = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbarbutton"
    );
    toolsButton.setAttribute("id", "tools-button");
    toolsButton.setAttribute("class", "tools-menu");
    toolsButton.setAttribute("removable", "false");
    toolsButton.setAttribute("cui-areatype", "toolbar");
    const toolsLabel = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "label"
    );
    toolsLabel.setAttribute("value", "Tools");

    const toolsPopup = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menupopup"
    );

    const toolsItems = [
      { label: "Diagnose Connection Problems...", class: "tools-item1" },
      { label: "Reopen Last Browsing Session", class: "tools-item2" },
      { label: "Pop-up Blocker", class: "tools-item3", submenu: true, separator: true },
      { label: "Manage Add-ons", class: "tools-item4" },
      { label: "Reader View", class: "tools-item5", separator: true  },
      { label: "Full Screen", class: "tools-item6" },
      { label: "Toolbars", class: "tools-item7", submenu: true },
      { label: "Explorer Bars", class: "tools-item8", submenu: true },
      { label: "Task Manager", class: "tools-item9", separator: true },
      { label: "Internet Options", class: "tools-item10", separator: true },
    ];

    for (let i = 0; i < toolsItems.length; i++) {
      const toolsItem = document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        toolsItems[i].submenu ? "menu" : "menuitem"
      );

      toolsItem.setAttribute("label", toolsItems[i].label);
      toolsItem.setAttribute("class", toolsItems[i].class);

      if (toolsItems[i].separator) {
        const separator = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menuseparator"
        );
        separator.setAttribute("orient", "horizontal");
        toolsPopup.appendChild(separator);
      }

      if (toolsItems[i].submenu) {
        const submenu = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menupopup"
        );

        if (toolsItems[i].class === "tools-item3") {
          const subItems = [
            { label: "Turn off Pop-up Blocker", class: "tools-subitem1" },
            { label: "Pop-up Blocker Settings", class: "tools-subitem2" },
          ];

          for (let j = 0; j < subItems.length; j++) {
            const subItem = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuitem"
            );
            subItem.setAttribute("label", subItems[j].label);
            subItem.setAttribute("class", subItems[j].class);
            submenu.appendChild(subItem);
          }
        } else if (toolsItems[i].class === "tools-item7") {
          const subItems = [
            { label: "Menu Bar", class: "tools-subitem3" },
            { label: "Favorites Bar", class: "tools-subitem4" },
            { label: "Command Bar", class: "tools-subitem5" },
            { label: "Customize Toolbar...", class: "tools-subitem6" },
          ];

          for (let j = 0; j < subItems.length; j++) {
            const subItem = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuitem"
            );
            subItem.setAttribute("label", subItems[j].label);
            subItem.setAttribute("class", subItems[j].class);
            submenu.appendChild(subItem);
          }
        } else if (toolsItems[i].class === "tools-item8") {
          const subItems = [
            { label: "Favorites", class: "tools-subitem7" },
            { label: "History", class: "tools-subitem8" },
          ];

          for (let j = 0; j < subItems.length; j++) {
            const subItem = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menuitem"
            );
            subItem.setAttribute("label", subItems[j].label);
            subItem.setAttribute("class", subItems[j].class);
            submenu.appendChild(subItem);
          }
        }

        toolsItem.appendChild(submenu);
      }

      toolsPopup.appendChild(toolsItem);
    }

    toolsButton.appendChild(toolsPopup);
    toolsButton.addEventListener("click", function () {
      toolsPopup.openPopup(toolsButton, "after_start", 0, 0, true, false);
    });

    toolsButton.appendChild(toolsLabel);
    toolsToolbar.appendChild(toolsButton);

    tabsToolbar.appendChild(toolsToolbar);
  }
  
  // Tools Menu Items functions
  const toolsitem1 = document.querySelector(".tools-item1");
  const toolsitem2 = document.querySelector(".tools-item2");
  const toolsitem3 = document.querySelector(".tools-item3");
  const toolsitem4 = document.querySelector(".tools-item4");
  const toolsitem5 = document.querySelector(".tools-item5");
  const toolsitem6 = document.querySelector(".tools-item6");
  const toolsitem7 = document.querySelector(".tools-item7");
  const toolsitem8 = document.querySelector(".tools-item8");
  const toolsitem9 = document.querySelector(".tools-item9");
  const toolsitem10 = document.querySelector(".tools-item10");
  
  const toolsubitem1 = document.querySelector(".tools-subitem1");
  const toolsubitem2 = document.querySelector(".tools-subitem2");
  const toolsubitem3 = document.querySelector(".tools-subitem3");
  const toolsubitem4 = document.querySelector(".tools-subitem4");
  const toolsubitem5 = document.querySelector(".tools-subitem5");
  const toolsubitem6 = document.querySelector(".tools-subitem6");
  const toolsubitem7 = document.querySelector(".tools-subitem7");
  const toolsubitem8 = document.querySelector(".tools-subitem8");
  
  


if (toolsitem1) {
  const openGoogleSearch = function (event) {
   safeModeRestart();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem1.addEventListener("command", openGoogleSearch);
}  

if (toolsitem2) {
  const openGoogleSearch = function (event) {
   SessionStore.restoreLastSession();

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem2.addEventListener("command", openGoogleSearch);
}  


if (toolsubitem1) {
  const openGoogleSearch = function (event) {
   gBrowser.selectedBrowser.popupBlocker.unblockAllPopups();

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem1.addEventListener("command", openGoogleSearch);
}



if (toolsubitem2) {
  const openGoogleSearch = function (event) {
   openPreferences("privacy-permissions-block-popups");

    const paste = readFromClipboard();

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem2.addEventListener("command", openGoogleSearch);
}


if (toolsitem4) {
  const openGoogleSearch = function (event) {
   gUnifiedExtensions.togglePanel(event);

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem4.addEventListener("command", openGoogleSearch);
}
 
if (toolsitem5) {
  const openGoogleSearch = function (event) {
   AboutReaderParent.toggleReaderMode(event);

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem5.addEventListener("command", openGoogleSearch);
}
 

if (toolsitem6) {
  const openGoogleSearch = function (event) {
   BrowserFullScreen();

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem6.addEventListener("command", openGoogleSearch);
}


if (toolsubitem3) {
  const toggleMenuBar = function (event) {
    const menuBar = document.getElementById("toolbar-menubar");
    
    if (menuBar) {
      if (menuBar.getAttribute("autohide") === "true") {
        menuBar.setAttribute("autohide", "false");
      } else {
        menuBar.setAttribute("autohide", "true");
      }
    }
  };

  toolsubitem3.addEventListener("command", toggleMenuBar);
}



if (toolsubitem4) {
  const openGoogleSearch = function (event) {
   SidebarUI.toggle('viewBookmarksSidebar');

    const paste = readFromClipboard();

	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem4.addEventListener("command", openGoogleSearch);
}

if (toolsubitem5) {
  const openGoogleSearch = function (event) {
   BookmarkingUI.toggleBookmarksToolbar('shortcut');

    const paste = readFromClipboard();

	
    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem5.addEventListener("command", openGoogleSearch);
}



if (toolsubitem6) {
  const openGoogleSearch = function (event) {
   gCustomizeMode.enter();

    const paste = readFromClipboard();

	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem6.addEventListener("command", openGoogleSearch);
}


if (toolsubitem7) {
  const openGoogleSearch = function (event) {
   SidebarUI.toggle('viewBookmarksSidebar');

    const paste = readFromClipboard();

	
    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem7.addEventListener("command", openGoogleSearch);
}


if (toolsubitem8) {
  const openGoogleSearch = function (event) {
   PlacesCommandHook.showPlacesOrganizer('History'); CustomizableUI.hidePanelForNode(this);

    const paste = readFromClipboard();

	
    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsubitem8.addEventListener("command", openGoogleSearch);
}



if (toolsitem9) {
  const openGoogleSearch = function (event) {
   switchToTabHavingURI('about:processes', true);

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem9.addEventListener("command", openGoogleSearch);
}



if (toolsitem10) {
  const openGoogleSearch = function (event) {
   openPreferences();

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  toolsitem10.addEventListener("command", openGoogleSearch);
}
 
});

// Help Menu
window.addEventListener("load", function () {
  const tabsToolbar = document.getElementById("TabsToolbar");

  if (tabsToolbar) {
    const hpToolbarButton = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbarbutton"
    );

    hpToolbarButton.setAttribute("id", "hp-button");
    hpToolbarButton.setAttribute("class", "hp");
    hpToolbarButton.setAttribute("removable", "false");
    hpToolbarButton.setAttribute("cui-areatype", "toolbar");

    const hpPopup = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menupopup"
    );

    const hpMenuItems = [
      { label: "Internet Explorer Help", class: "hp-item1" },
      { label: "What's New in Internet Explorer", class: "hp-item2" },
      { label: "Online Support", class: "hp-item3" },
      { label: "About Internet Explorer", class: "hp-item4" }
    ];

    for (let i = 0; i < hpMenuItems.length; i++) {
      const hpMenuItem = document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        "menuitem"
      );

      hpMenuItem.setAttribute("label", hpMenuItems[i].label);
      hpMenuItem.setAttribute("class", hpMenuItems[i].class);

      hpPopup.appendChild(hpMenuItem);

      if (i === 0 || i === 2) {
        const separator = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "menuseparator"
        );
        separator.setAttribute("orient", "horizontal");
        hpPopup.appendChild(separator);
      }
    }

    hpToolbarButton.appendChild(hpPopup);

    hpToolbarButton.addEventListener("click", function () {
      hpPopup.openPopup(hpToolbarButton, "after_start", 0, 0, true, false);
    });

    tabsToolbar.appendChild(hpToolbarButton);
  }
  
  // Help Menu Items functions
  const hpitem1 = document.querySelector(".hp-item1");
  const hpitem2 = document.querySelector(".hp-item2");
  const hpitem3 = document.querySelector(".hp-item3");
  const hpitem4 = document.querySelector(".hp-item4");
  
  
  
  
if (hpitem1) {
  const openGoogleSearch = function (event) {
   openHelpLink('firefox-help');

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  hpitem1.addEventListener("command", openGoogleSearch);
}
   
  
if (hpitem2) {
  const openGoogleSearch = function (event) {
   window.open("https://www.mozilla.org/", "mozillaTab");

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  hpitem1.addEventListener("command", openGoogleSearch);
}


 
if (hpitem2) {
  const openSpaceHey = function (event) {
    const spaceHeyURL = "https://github.com/florinsdistortedvision/rinfox_updated/commits/main";
    
    const newTab = window.gBrowser.addTrustedTab(spaceHeyURL);

    window.gBrowser.selectedTab = newTab;
  };

  hpitem2.addEventListener("command", openSpaceHey);
}

if (hpitem3) {
  const openSpaceHey = function (event) {
    const spaceHeyURL = "https://github.com/florinsdistortedvision/rinfox_updated/issues";
    
    const newTab = window.gBrowser.addTrustedTab(spaceHeyURL);

    window.gBrowser.selectedTab = newTab;
  };

  hpitem3.addEventListener("command", openSpaceHey);
}


if (hpitem4) {
  const openGoogleSearch = function (event) {
   openAboutDialog();

    const paste = readFromClipboard();
	

    if (paste) {
      const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(paste);

      gBrowser.selectedTab = gBrowser.addTab(searchURL);
    }
  };

  hpitem4.addEventListener("command", openGoogleSearch);
}
});


