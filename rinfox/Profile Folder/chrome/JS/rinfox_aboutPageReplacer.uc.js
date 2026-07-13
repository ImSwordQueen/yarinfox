// ==UserScript==
// @name           rinfox - About Page Replacer
// @description    Replaces Firefox new-tab and private-browsing pages.
// ==/UserScript==

const rinfoxAboutPages = {
	newtab: "chrome://userchrome/content/pages/newTab/index.html",
	privatebrowsing: "chrome://userchrome/content/pages/inPrivate/index.html",
};

function RinfoxAboutPage(url) {
	this.uri = Services.io.newURI(url);
}

RinfoxAboutPage.prototype = {
	newChannel(_uri, loadInfo) {
		const channel = Services.io.newChannelFromURIWithLoadInfo(this.uri, loadInfo);
		channel.owner = Services.scriptSecurityManager.getSystemPrincipal();
		return channel;
	},
	getURIFlags(_uri) {
		return Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.IS_SECURE_CHROME_UI;
	},
	getChromeURI(_uri) {
		return this.uri;
	},
	QueryInterface: ChromeUtils.generateQI(["nsIAboutModule"]),
};

for (const [aboutName, page] of Object.entries(rinfoxAboutPages)) {
	const factory = {
		createInstance(iid) {
			return new RinfoxAboutPage(page).QueryInterface(iid);
		},
		QueryInterface: ChromeUtils.generateQI(["nsIFactory"]),
	};

	Components.manager.QueryInterface(Ci.nsIComponentRegistrar).registerFactory(
		Components.ID(Services.uuid.generateUUID().toString()),
		`about:${aboutName}`,
		`@mozilla.org/network/protocol/about;1?what=${aboutName}`,
		factory
	);
}

