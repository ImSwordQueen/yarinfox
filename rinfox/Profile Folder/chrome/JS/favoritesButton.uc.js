// ==UserScript==
// @name			Favorites Button
// @description 	Adds favorites button
// @author			Travis
// @include			main
// ==/UserScript==
// 2025 Note: WHY IS IT NAMED HELP BUTTON BUT HAS MORE STUFF INSIDE BRUH???

var { CustomizableUI } = ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
var { PlacesUtils } = ChromeUtils.importESModule("resource://gre/modules/PlacesUtils.sys.mjs");
var addToBookmarksModePref = "rinfox.favorites.useFirefoxDialog";

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
            addBookmark();
        },
        onCreated: function(button) {
            createAddToBookmarksContextMenu(button.ownerDocument);
            button.setAttribute("context", "addToBookmarksBarContextMenu");
            return button;
        },
    });
    if (!CustomizableUI.getPlacementOfWidget("addToBookmarksBarButton")) {
        CustomizableUI.addWidgetToArea("addToBookmarksBarButton", CustomizableUI.AREA_BOOKMARKS);
    }
}
catch (e) {
    Components.utils.reportError(e);
};

};

function createAddToBookmarksContextMenu(document) {
    if (document.getElementById("addToBookmarksBarContextMenu")) {
        return;
    }

    var menu = document.createXULElement("menupopup");
    menu.id = "addToBookmarksBarContextMenu";
    menu.addEventListener("popupshowing", function() {
        var useFirefoxDialog = Services.prefs.getBoolPref(addToBookmarksModePref, false);
        automaticItem.setAttribute("checked", !useFirefoxDialog);
        firefoxItem.setAttribute("checked", useFirefoxDialog);
    });

    var automaticItem = document.createXULElement("menuitem");
    automaticItem.setAttribute("type", "radio");
    automaticItem.setAttribute("name", "addToBookmarksMode");
    automaticItem.setAttribute("label", "Add automatically to Favorites Bar");
    automaticItem.addEventListener("command", function() {
        Services.prefs.setBoolPref(addToBookmarksModePref, false);
    });
    menu.appendChild(automaticItem);

    var firefoxItem = document.createXULElement("menuitem");
    firefoxItem.setAttribute("type", "radio");
    firefoxItem.setAttribute("name", "addToBookmarksMode");
    firefoxItem.setAttribute("label", "Use Firefox bookmark dialog");
    firefoxItem.addEventListener("command", function() {
        Services.prefs.setBoolPref(addToBookmarksModePref, true);
    });
    menu.appendChild(firefoxItem);

    document.getElementById("mainPopupSet").appendChild(menu);
}

function addBookmark() {
    if (Services.prefs.getBoolPref(addToBookmarksModePref, false)) {
        addBookmarkWithFirefox();
        return;
    }

    addToBookmarksBar();
}

async function addBookmarkWithFirefox() {
    var bookmarkAction = PageActions.actionForID(PageActions.ACTION_ID_BOOKMARK);
    var previousAnchor = bookmarkAction._anchorIDOverride;
    bookmarkAction._anchorIDOverride = "addToBookmarksBarButton";

    try {
        await PlacesCommandHook.bookmarkPage();
    } finally {
        bookmarkAction._anchorIDOverride = previousAnchor;
    }
}

async function addToBookmarksBar() {
    await PlacesUtils.bookmarks.insert({
        parentGuid: PlacesUtils.bookmarks.toolbarGuid,
        url: gBrowser.currentURI.spec,
        title: window.document.title || gBrowser.currentURI.spec,
    });
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
            onCommand: function(event) {
                var browserWindow = event.target.ownerGlobal;
                Services.prefs.setBoolPref("sidebar.position_start", true);
                browserWindow.SidebarController.toggle("viewBookmarksSidebar");
            },
            onCreated: function(button) {
                return button;
            },
        });
        if (!CustomizableUI.getPlacementOfWidget("bookmarksSidebarButton")) {
            CustomizableUI.addWidgetToArea("bookmarksSidebarButton", CustomizableUI.AREA_BOOKMARKS);
        }
    }
    catch (e) {
        Components.utils.reportError(e);
    }
};