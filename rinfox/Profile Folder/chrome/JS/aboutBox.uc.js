// ==UserScript==
// @name			About Box
// @description 	Changes aboutDialog to look like Internet Explorer's
// @author			Travis
// @include			chrome://browser/content/aboutDialog.xhtml
// ==/UserScript==

console.log("AboutBox: Script loaded");

(function () {

console.log("AboutBox: IIFE executing");

// Import Services for preference reading
// Use a different approach for the about dialog window
var _isIE8Cached = null;
function checkIE8Pref() {
    if (_isIE8Cached !== null) return _isIE8Cached;

    try {
        // Try to access Services from the opener window (main browser window)
        if (window.opener && window.opener.Services && window.opener.Services.prefs) {
            _isIE8Cached = window.opener.Services.prefs.getBoolPref("RinFox.Appearance.IE8", false);
            console.log("AboutBox: Got IE8 pref from opener window:", _isIE8Cached);
            return _isIE8Cached;
        }
    } catch (e) {
        console.log("AboutBox: Could not get pref from opener:", e);
    }

    try {
        // Try importing Services directly
        const {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");
        _isIE8Cached = Services.prefs.getBoolPref("RinFox.Appearance.IE8", false);
        console.log("AboutBox: Got IE8 pref from direct import:", _isIE8Cached);
        return _isIE8Cached;
    } catch (e) {
        console.log("AboutBox: Could not import Services:", e);
        _isIE8Cached = false;
        return false;
    }
}

var aboutDialog = document.getElementById("aboutDialog");
var aboutDialogContainer = document.getElementById("aboutDialogContainer");

console.log("AboutBox: aboutDialog element:", aboutDialog);
console.log("AboutBox: aboutDialogContainer element:", aboutDialogContainer);

function setAttributes(element, attributes) {
		Object.keys(attributes).forEach(attr => {
		element.setAttribute(attr, attributes[attr]);
	});
}

// Title of About Window
var aboutDialogTitle = "About Internet Explorer";

// Check if IE8 mode is enabled
const isIE8Bool = checkIE8Pref();

console.log("AboutBox: isIE8Bool =", isIE8Bool);

// Set IE8 attribute on dialog for CSS targeting
if (isIE8Bool) {
	aboutDialog.setAttribute("data-rinfox-ie8", "true");
	console.log("AboutBox: Set data-rinfox-ie8 attribute on aboutDialog");
}

aboutDialog.setAttribute("title", ""+aboutDialogTitle+"");

// createElement because xhtml is dogshit 

// Windows Internet Explorer Banner
const aboutboxbanner = document.createElement("img");
let bannersrc;
if (isIE8Bool) {
	bannersrc = "chrome://userchrome/content/images/banner-ie8.png";
} else {
	bannersrc = "chrome://userchrome/content/images/banner.png";
}
const aboutboxbannerattributes = {
	"class": "aboutBoxBanner",
	"src": ""+bannersrc+"",
	"width": "314px",
	"height": "76px"
};

// Internet Explorer Information
const aboutboxinfolist = document.createElement('ul');
let aboutboxinfoversion;
let aboutboxinfostregnth;
let aboutboxinfoid;
let aboutboxinfoupdate;
if (isIE8Bool) {
	aboutboxinfoversion = "Version: 8.0.6001.18702";
	aboutboxinfostregnth = "Cipher Strength: 256-bit";
	aboutboxinfoid = "Product ID: 01404-014-0000025-714000";
	aboutboxinfoupdate = "Update Versions: 0";
} else {
	aboutboxinfoversion = "Version: 7.0.6002.18005";
	aboutboxinfostregnth = "Cipher Strength: 256-bit";
	aboutboxinfoid = "Product ID: 89580-014-0000025-71495";
	aboutboxinfoupdate = "Update Versions:0";
}
const aboutboxinfo = [
	""+aboutboxinfoversion+"", 
	""+aboutboxinfostregnth+"", 
	""+aboutboxinfoid+"", 
	""+aboutboxinfoupdate+""
];
	
for (i = 0; i <= aboutboxinfo.length - 1; i++) {
	const li = document.createElement('li');
	li.innerHTML = aboutboxinfo[i];
	aboutboxinfolist.appendChild(li);
};

// Text Area Legal Notice
const legalnotice = document.createElement('textarea');
const legalnoticestring = document.createTextNode("Warning: This computer program is protected by copyright law and international treaties. Unauthorized reproduction or distribution of this program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.");
legalnotice.setAttribute("readonly", "true");
legalnotice.appendChild(legalnoticestring);


// Windows Flag
const windowsflag = document.createElement("img");
const windowsflagattributes = {
	"class": "windowsFlag",
	"src": "chrome://userchrome/content/images/windows-flag.png",
	"width": "38px",
	"height": "38px"
};

// Copyright link
const copyrightlink = document.createElement("a");
let copyrightlinktext;
if (isIE8Bool) {
	copyrightLinkText = "©2009 Microsoft Corporation";
} else {
	copyrightLinkText = "©2006 Microsoft Corporation";
}
var copyrightLinkNode = document.createTextNode(copyrightLinkText);
copyrightlink.appendChild(copyrightLinkNode);
copyrightlink.addEventListener("click", (event) => {
	_ucUtils.loadURI(window,{
		url: "http://go.microsoft.com/fwlink/?LinkId=54758",
		where: "window"
	});
});

// Close Button
const closebutton = document.createElement("button");
const closebuttontext = document.createTextNode("OK");
closebutton.appendChild(closebuttontext);
closebutton.addEventListener("click", (event) => { window.close() });

// Set Attributes
setAttributes(aboutboxbanner, aboutboxbannerattributes);
setAttributes(windowsflag, windowsflagattributes);
aboutboxinfolist.setAttribute("class", "aboutBoxInfoList");
legalnotice.setAttribute("class", "legalNotice");
closebutton.setAttribute("class", "closeButton");
copyrightlink.setAttribute("class", "copyrightLink");

const footercontainer = document.createElement("div");
footercontainer.setAttribute("class", "footerContainer");

// Clear HTML and append new HTML
aboutDialogContainer.innerHTML = '';
aboutDialogContainer.appendChild(aboutboxbanner);
aboutDialogContainer.appendChild(aboutboxinfolist);
aboutDialogContainer.appendChild(legalnotice);
aboutDialogContainer.appendChild(footercontainer);
footercontainer.appendChild(windowsflag);
footercontainer.appendChild(copyrightlink);
footercontainer.appendChild(closebutton);

})();