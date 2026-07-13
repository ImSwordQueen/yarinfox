(function () {
	var css = `
    tooltip, aHTMLTooltip {
        appearance: auto !important;
        -moz-default-appearance: tooltip !important;
    }
	`;

	var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
	var uri = Services.io.newURI('data:text/css;charset=UTF-8,' + encodeURIComponent(css));

	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

})();