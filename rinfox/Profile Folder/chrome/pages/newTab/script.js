"use strict";

const { NewTabUtils } = ChromeUtils.importESModule("resource://gre/modules/NewTabUtils.sys.mjs");
const REOPEN_TABS_MODE_PREF = "rinfox.newtab.reopenTabs.mode";
const FALLBACK_ICON = "chrome://userchrome/content/images/blank-page.png";

function getReopenTabsMode() {
	try {
		const mode = Services.prefs.getIntPref(REOPEN_TABS_MODE_PREF);
		return mode >= 0 && mode <= 2 ? mode : 0;
	} catch (_error) {
		return 0;
	}
}

function getRecentTabs() {
	return NewTabUtils.activityStreamProvider.getTopFrecentSites({ numItems: 10 });
}

function makeTabItem({ title, url, favicon, onOpen }) {
	const item = document.createElement("div");
	item.className = "recent-tab";

	const icon = document.createElement("img");
	icon.alt = "";
	icon.src = favicon || FALLBACK_ICON;
	icon.addEventListener("error", () => {
		icon.src = FALLBACK_ICON;
	}, { once: true });

	const link = document.createElement("a");
	link.href = url;
	link.textContent = title || url;
	link.title = url;
	if (onOpen) {
		link.addEventListener("click", event => {
			event.preventDefault();
			onOpen();
		});
	}

	item.append(icon, link);
	return item;
}

function showClosedTabs(container, currentSessionOnly) {
	const topWindow = window.browsingContext.topChromeWindow;
	const { SessionStore } = ChromeUtils.importESModule("resource:///modules/sessionstore/SessionStore.sys.mjs");
	let closedTabs = SessionStore.getClosedTabDataForWindow(topWindow);
	if (typeof closedTabs === "string") {
		closedTabs = JSON.parse(closedTabs);
	}
	const indexedTabs = closedTabs.map((closedTab, index) => ({ closedTab, index }));
	if (currentSessionOnly) {
		const sessionStartedAt = Services.startup.getStartupInfo().process.getTime();
		closedTabs = indexedTabs.filter(({ closedTab }) => closedTab.closedAt >= sessionStartedAt);
	} else {
		closedTabs = indexedTabs;
	}

	if (!closedTabs.length) {
		const empty = document.createElement("span");
		empty.className = "empty";
		empty.textContent = "Tabs that you close will appear here";
		container.appendChild(empty);
		return;
	}

	closedTabs.slice(0, 10).forEach(({ closedTab, index }) => {
		const entries = closedTab.state?.entries || [];
		const activeEntry = entries[(closedTab.state?.index || entries.length) - 1] || {};
		container.appendChild(makeTabItem({
			title: closedTab.title || activeEntry.title,
			url: activeEntry.url || "about:blank",
			favicon: closedTab.image || closedTab.state?.image,
			onOpen: () => topWindow.undoCloseTab(index),
		}));
	});
}

async function showRecentTabs() {
	const container = document.getElementById("recentTabs");
	container.replaceChildren();

	try {
		const mode = getReopenTabsMode();
		if (mode === 1 || mode === 2) {
			showClosedTabs(container, mode === 1);
			return;
		}

		const rows = await getRecentTabs();
		if (!rows.length) {
			const empty = document.createElement("span");
			empty.className = "empty";
			empty.textContent = "Pages that you visit will appear here";
			container.appendChild(empty);
			return;
		}

		for (const site of rows) {
			container.appendChild(makeTabItem(site));
		}
	} catch (error) {
		console.error("rinfox could not load reopen tabs", error);
		const empty = document.createElement("span");
		empty.className = "empty";
		empty.textContent = "Reopen closed tabs is unavailable";
		container.appendChild(empty);
	}
}

function configureToggle(id, contentId) {
	const button = document.getElementById(id);
	const content = document.getElementById(contentId);
	const image = button.querySelector(".expando");

	button.addEventListener("click", async () => {
		const expanded = button.getAttribute("aria-expanded") === "true";
		button.setAttribute("aria-expanded", String(!expanded));
		content.hidden = expanded;
		image.src = expanded
			? "chrome://userchrome/content/pages/shared/expand_nor.png"
			: "chrome://userchrome/content/pages/shared/collapse_nor.png";

		if (!expanded && id === "recentTabsToggle") {
			await showRecentTabs();
		}
	});

	button.addEventListener("mouseenter", () => {
		image.src = button.getAttribute("aria-expanded") === "true"
			? "chrome://userchrome/content/pages/shared/collapse_hvr.png"
			: "chrome://userchrome/content/pages/shared/expand_hvr.png";
	});

	button.addEventListener("mouseleave", () => {
		image.src = button.getAttribute("aria-expanded") === "true"
			? "chrome://userchrome/content/pages/shared/collapse_nor.png"
			: "chrome://userchrome/content/pages/shared/expand_nor.png";
	});
}

configureToggle("recentTabsToggle", "recentTabs");
configureToggle("acceleratorsToggle", "acceleratorLinks");
showRecentTabs();

document.getElementById("inPrivateWindow").addEventListener("click", event => {
	event.preventDefault();
	window.browsingContext.topChromeWindow.OpenBrowserWindow({ private: true });
});

const clipboardPanel = document.getElementById("clipboardText");
const clipboardValue = document.getElementById("clipboardValue");
const clipboardLabel = document.getElementById("clipboardLabel");
const clipboardStats = document.getElementById("clipboardStats");
const showClipboard = document.getElementById("showClipboard");
const removeClipboardText = document.getElementById("removeClipboardText");
const removeClipboardImage = removeClipboardText.querySelector("img");

showClipboard.addEventListener("click", async event => {
	event.preventDefault();
	try {
		const text = await navigator.clipboard.readText();
		clipboardLabel.hidden = !text;
		clipboardValue.textContent = text ? text.slice(0, 50) : "Your clipboard text will appear here";
		clipboardStats.hidden = text.length <= 50;
		clipboardStats.textContent = `(Showing the first 50 of ${text.length} characters in the Clipboard)`;
	} catch (_error) {
		clipboardValue.textContent = "Clipboard text is unavailable.";
		clipboardLabel.hidden = true;
		clipboardStats.hidden = true;
	}
	clipboardPanel.hidden = false;
	showClipboard.hidden = true;
});

removeClipboardText.addEventListener("click", () => {
	clipboardLabel.hidden = false;
	clipboardValue.textContent = "";
	clipboardStats.textContent = "";
	clipboardStats.hidden = true;
	clipboardPanel.hidden = true;
	showClipboard.hidden = false;
});

removeClipboardText.addEventListener("mouseenter", () => {
	removeClipboardImage.src = "chrome://userchrome/content/pages/shared/close_hvr.png";
});

removeClipboardText.addEventListener("mouseleave", () => {
	removeClipboardImage.src = "chrome://userchrome/content/pages/shared/close_nor.png";
});
