// ==UserScript==
// @name			Scripts Loader
// @description 	Loads resources required for RinFox
// @author			Travis
// @include			main
// ==/UserScript==

const { ctypes } = ChromeUtils.import("resource://gre/modules/ctypes.jsm");

function executeFunctions() {
	getAndSetTitleBarHeight();
	applySmallBorderHack();
	moveBookmarksBar();
	hideTabBarItems();
	changeLibraryButtonText();
	changeFirefoxButtonText();
	changeUnifiedExtensionsText();
	changeSearchBarPlaceholder();
	createFavoritesSidebarButton();
	createAddToBookmarks();
	disableHistoryButton();
	createCBHomeButton();
	moveExtensionsBtn();
	createCBReadMailButton();
	loadLocale();
	convertCheckboxesToNativeLook()
	openRinFoxWizardWindow(true);
    console.info("Functions executed.");
}

window.addEventListener("load", function () {
    executeFunctions();  
})