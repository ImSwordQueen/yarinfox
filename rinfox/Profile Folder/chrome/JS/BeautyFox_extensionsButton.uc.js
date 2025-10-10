// ==UserScript==
// @name        BeautyFox - Extensions Button
// @author      AngelBruni
// @loadorder   3
// ==/UserScript==

function moveExtensionsBtn() {
    let unifiedExtensionsButton = document.getElementById("unified-extensions-button");
    let PanelUImenubutton = document.getElementById("PanelUI-menu-button");
	
    if (unifiedExtensionsButton) {
        let personalBookmarks = document.getElementById("personal-bookmarks");
        let personalToolbar = document.getElementById("PersonalToolbar");
        let endToolbar = document.getElementById("endToolbar");
        let IEMenuButton = document.getElementById("IEMenuButton");
		
		unifiedExtensionsButton.style.cssText = null;
		PanelUImenubutton.style.cssText = null;
		
		switch (pref("BeautyFox.option.storedExtensionsButtonChoice").tryGet.int()) {
			case 0:
				unifiedExtensionsButton.style.cssText = 'appearance: none !important; max-width: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; position: absolute; opacity: 0; pointer-events: none;';
				PanelUImenubutton.style.cssText = 'appearance: none !important; max-width: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; position: absolute; opacity: 0; pointer-events: none;';
		
				break;
			case 1:
				if (personalBookmarks && personalToolbar) {
					unifiedExtensionsButton.parentNode.removeChild(unifiedExtensionsButton);
					PanelUImenubutton.parentNode.removeChild(PanelUImenubutton);
					personalToolbar.insertBefore(unifiedExtensionsButton, personalBookmarks);
					personalToolbar.insertBefore(PanelUImenubutton, personalBookmarks);
				}
				break;
			case 2:
				if (endToolbar && IEMenuButton) {
					unifiedExtensionsButton.parentNode.removeChild(unifiedExtensionsButton);
					PanelUImenubutton.parentNode.removeChild(PanelUImenubutton);
					endToolbar.insertBefore(unifiedExtensionsButton, IEMenuButton);
					endToolbar.insertBefore(PanelUImenubutton, IEMenuButton);
				}
		}
    }
}