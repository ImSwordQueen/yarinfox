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
		
		var extensionsButtonHiddenStyles = [
			'appearance',
			'max-width',
			'margin',
			'padding',
			'overflow',
			'position',
			'opacity',
			'pointer-events'
		];
		var clearExtensionsButtonStyles = (button) => {
			extensionsButtonHiddenStyles.forEach((property) => button.style.removeProperty(property));
		};
		var hideExtensionsButton = (button) => {
			button.style.setProperty('appearance', 'none', 'important');
			button.style.setProperty('max-width', '0', 'important');
			button.style.setProperty('margin', '0', 'important');
			button.style.setProperty('padding', '0', 'important');
			button.style.setProperty('overflow', 'hidden', 'important');
			button.style.position = 'absolute';
			button.style.opacity = '0';
			button.style.pointerEvents = 'none';
		};
		clearExtensionsButtonStyles(unifiedExtensionsButton);
		clearExtensionsButtonStyles(PanelUImenubutton);
		
		switch (pref("BeautyFox.option.storedExtensionsButtonChoice").tryGet.int()) {
			case 0:
				hideExtensionsButton(unifiedExtensionsButton);
				hideExtensionsButton(PanelUImenubutton);
		
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