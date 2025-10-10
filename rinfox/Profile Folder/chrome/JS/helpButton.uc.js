// ==UserScript==
// @name			Help Button
// @description 	Adds help button
// @author			Travis
// @include			main
// ==/UserScript==

Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
var appversion = parseInt(Services.appinfo.version);

function createHelpButton() {
  try {
    var button_label = "Help";

    CustomizableUI.createWidget({
      id: "help-button",
      defaultArea: CustomizableUI.AREA_TABSTRIP,
      removable: true,
      label: button_label,
      tooltiptext: button_label,
onClick: function(event) {
        if(event.button == '0') {
          const appDataDir = Services.dirsvc.get("AppData", Components.interfaces.nsIFile);
          
          const relativePath = "Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\ImplicitAppShortcuts\\9d91276b0be3e46b\\pinned.lnk";

          const file = appDataDir.clone();
          file.appendRelativePath(relativePath);
          
          if (file.exists()) {
            const process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
            process.init(file);
            process.run(false, [], 0);
          } else {
            alert("Windows 7 Help and Support not found. If you are on Windows 10 make sure you have restored Windows 7 Help and Support then try again.");
          }
        }
      },
      onCreated: function(button) {
        return button;
      }
    });

  } catch (e) {
    Components.utils.reportError(e);
  }
};

function createAddToBookmarks() {

try {
    var buttonText = "Add to Favorites Bar";

    CustomizableUI.createWidget({
        id: "addToBookmarksBarButton",
        defaultArea: CustomizableUI.AREA_BOOKMARKS,
        removable: true,
        label: buttonText,
        tooltiptext: buttonText,
        onCommand: function() {
            addToBookmarksBar();
        },
        onCreated: function(button) {
            return button;
        },
    });
}
catch (e) {
    Components.utils.reportError(e);
};

};

function addToBookmarksBar() {
    var bookmarksSvc = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
    bookmarksSvc.insertBookmark(3, gBrowser.currentURI, bookmarksSvc.DEFAULT_INDEX, window.document.title);
}

function createFavoritesSidebarButton() {
    try {
        var buttonText = "Favorites";
    
        CustomizableUI.createWidget({
            id: "bookmarksSidebarButton",
            defaultArea: CustomizableUI.AREA_BOOKMARKS,
            removable: true,
            label: buttonText,
            tooltiptext: buttonText,
            onCommand: function() {
                SidebarUI.toggle('viewBookmarksSidebar');
				SidebarUI.reversePosition();
            },
            onCreated: function(button) {
                return button;
            },
        });
    }
    catch (e) {
        Components.utils.reportError(e);
    }
};