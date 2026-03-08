// ==UserScript==
// @name			Favorites Button
// @description 	Adds favorites button
// @author			Travis
// @include			main
// ==/UserScript==
// 2025 Note: WHY IS IT NAMED HELP BUTTON BUT HAS MORE STUFF INSIDE BRUH???

if (typeof CustomizableUI === "undefined") {
    ChromeUtils.import("resource:///modules/CustomizableUI.jsm");
}
// Firefox 140 compatibility - use different import methods
if (typeof Services === "undefined") {
    try {
        ChromeUtils.defineESModuleGetters(this, {
            Services: "resource://gre/modules/Services.sys.mjs",
        });
    } catch (e) {
        try {
            var {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
        } catch (e2) {
            console.error("Failed to load Services:", e, e2);
        }
    }
}
var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
var appversion = parseInt(Services.appinfo.version);

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
    console.error(e);
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
                try {
                    if (typeof SidebarUI !== 'undefined' && SidebarUI.toggle) {
                        SidebarUI.toggle('viewBookmarksSidebar');
                        if (typeof SidebarUI.reversePosition === 'function') {
                            SidebarUI.reversePosition();
                        }
                    }
                } catch (e) {
                    console.error("SidebarUI error:", e);
                }
            },
            onCreated: function(button) {
                return button;
            },
        });
    }
    catch (e) {
        console.error(e);
    }
};