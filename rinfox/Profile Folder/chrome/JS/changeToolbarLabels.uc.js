// ==UserScript==
// @name			Change Toolbar Labels
// @description 	Changes the label of Toolbar Buttons
// @author			Travis
// @include			main
// ==/UserScript==

var { CustomizableUI } = ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");

function makeToolbarButtonMovable(widgetId) {
	const button = document.getElementById(widgetId);

	if (!button) {
		return;
	}

	button.setAttribute("removable", "true");
	button.setAttribute("cui-areatype", "toolbar");
	button.classList.add("chromeclass-toolbar-additional");

}

const TabToolbarCustomization = document.getElementById("TabsToolbar-customization-target");
const movableToolbarButtons = ["library-button", "PanelUI-button", "unified-extensions-button"];
const movableButtonPref = "rinfox.toolbarButtonPlacements";

function saveMovableToolbarButtonPlacements() {
	const placements = {};

	for (const widgetId of movableToolbarButtons) {
		const button = document.getElementById(widgetId);
		const item = button?.parentElement?.localName === "toolbarpaletteitem"
			? button.parentElement
			: button;
		const parent = item?.parentElement;

		if (parent?.id) {
			placements[widgetId] = {
				parentId: parent.id,
				position: Array.prototype.indexOf.call(parent.children, item),
			};
		}
	}

	Services.prefs.setStringPref(movableButtonPref, JSON.stringify(placements));
}

function restoreMovableToolbarButtonPlacement(widgetId) {
	const placements = JSON.parse(Services.prefs.getStringPref(movableButtonPref, "{}"));
	const placement = placements[widgetId];
	const button = document.getElementById(widgetId);
	const parent = placement && document.getElementById(placement.parentId);

	if (!button || !parent) {
		return;
	}

	button.remove();
	const referenceNode = parent.children[placement.position] || null;
	parent.insertBefore(button, referenceNode);
}

window.addEventListener("customizationchange", saveMovableToolbarButtonPlacements);
window.addEventListener("aftercustomization", () => {
	for (const widgetId of movableToolbarButtons) {
		restoreMovableToolbarButtonPlacement(widgetId);
	}
});

function changeLibraryButtonText() {
	try {
		makeToolbarButtonMovable("library-button");
		restoreMovableToolbarButtonPlacement("library-button");
		const LibraryButtonLabel = document.querySelector("#library-button label.toolbarbutton-text");

		LibraryButtonLabel.setAttribute("value", "Favorites");
	} catch(error) {
		console.log("Can't rename ToolbarButton.");
	}
};

function changeFirefoxButtonText() {
	try {
		const PanelUIButton = document.getElementById("PanelUI-button");
		const PanelUIButtonLabel = document.querySelector("#PanelUI-menu-button label.toolbarbutton-text");

		makeToolbarButtonMovable("PanelUI-button");
		if (PanelUIButton.parentNode !== TabToolbarCustomization) {
			TabToolbarCustomization.appendChild(PanelUIButton);
		}
		restoreMovableToolbarButtonPlacement("PanelUI-button");
		PanelUIButtonLabel.setAttribute("value", "Options");
	} catch(error) {
		console.log("Can't rename ToolbarButton.");
	}
};

function changeUnifiedExtensionsText() {
	try {
		const UnifiedExtensionsButtonLabel = document.querySelector("#unified-extensions-button label.toolbarbutton-text");

		makeToolbarButtonMovable("unified-extensions-button");
		restoreMovableToolbarButtonPlacement("unified-extensions-button");
		UnifiedExtensionsButtonLabel.setAttribute("value", "Add-ons");
	} catch(error) {
		console.log("Can't rename ToolbarButton.");
	}
};

function moveOverflowButtonToTabsToolbar() {
	try {
		const OverflowButton = document.getElementById("nav-bar-overflow-button");

		OverflowButton.setAttribute("removable", "false");
		OverflowButton.setAttribute("skipintoolbarset", "true");
		if (OverflowButton.parentNode !== TabToolbarCustomization) {
			TabToolbarCustomization.appendChild(OverflowButton);
		}

		const NavigationToolbar = document.getElementById("nav-bar");
		const updateOverflowButtonVisibility = () => {
			OverflowButton.hidden = !NavigationToolbar.matches(
				"[overflowing], [nonemptyoverflow], [customizing]"
			);
		};
		const overflowObserver = new MutationObserver(updateOverflowButtonVisibility);

		overflowObserver.observe(NavigationToolbar, {
			attributes: true,
			attributeFilter: ["overflowing", "nonemptyoverflow", "customizing"],
		});
		updateOverflowButtonVisibility();
		window.addEventListener("unload", () => overflowObserver.disconnect(), { once: true });
	} catch(error) {
		console.log("Can't move Overflow ToolbarButton.");
	}
};

async function changeSearchBarPlaceholder() {
	try {
		const searchBarPlaceHolder = document.querySelector(".searchbar-textbox");
		const defaultEngine = await Services.search.getDefault();
		const iconURL = await defaultEngine.getIconURL(16);

		searchBarPlaceHolder.setAttribute("placeholder", defaultEngine.name);
		if (iconURL) {
			document.documentElement.style.setProperty("--dynamic-search-icon", `url("${iconURL}")`);
		} else {
			document.documentElement.style.removeProperty("--dynamic-search-icon");
		}
	} catch(error) {
		console.error("Can't update SearchBar placeholder or icon.", error);
	}
}

const searchEngineObserver = {
	observe(subject, topic, data) {
		if (topic === "browser-search-engine-modified" && data === "engine-default") {
			changeSearchBarPlaceholder();
		}
	},
};

Services.obs.addObserver(searchEngineObserver, "browser-search-engine-modified");
window.addEventListener("unload", () => {
	Services.obs.removeObserver(searchEngineObserver, "browser-search-engine-modified");
}, { once: true });