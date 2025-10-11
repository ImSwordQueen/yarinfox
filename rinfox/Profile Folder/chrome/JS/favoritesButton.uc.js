// ==UserScript==
// @name			Favorites Button
// @description 	Adds favorites button
// @author			Travis
// @include			main
// ==/UserScript==
// 2025 Note: WHY IS IT NAMED HELP BUTTON BUT HAS MORE STUFF INSIDE BRUH???

Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
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