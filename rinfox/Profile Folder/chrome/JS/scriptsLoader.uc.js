// ==UserScript==
// @name			Scripts Loader
// @description 	Loads resources required for RinFox
// @author			Travis
// @include			main
// @loadorder		1000
// ==/UserScript==

const { ctypes } = ChromeUtils.importESModule("resource://gre/modules/ctypes.sys.mjs");


function executeFunctions() {
	getAndSetTitleBarHeight();
	applySmallBorderHack();
	moveBookmarksBar();
	createNativeBrowserFrame();
	hideTabBarItems();
	changeLibraryButtonText();
	changeFirefoxButtonText();
	changeUnifiedExtensionsText();
	moveOverflowButtonToTabsToolbar();
	changeSearchBarPlaceholder();
	createFavoritesSidebarButton();
	createAddToBookmarks();
	disableHistoryButton();
	convertCheckboxesToNativeLook()
	openRinFoxWizardWindow(true);
    console.info("Functions executed.");
}

if (document.readyState === "complete") {
	executeFunctions();
} else {
	window.addEventListener("load", executeFunctions, { once: true });
}