// ==UserScript==
// @name        BeautyFox - Downloads Window
// @description Styles the Downloads window to resemble the one from Internet Explorer 9+.
// @include     chrome://browser/content/places/places.xhtml
// ==/UserScript==

function styleDownloads() {
    const downloadsList = document.getElementById('downloadsListBox');
    if (!downloadsList || downloadsList.getAttribute('hidden')) {
        return;
    }

    const places = document.getElementById('places');
    places.setAttribute('title', 'View Downloads - Windows Internet Explorer');

    const style = document.createProcessingInstruction(
        'xml-stylesheet',
        'href="chrome://userchrome/content/partials/content/downloads.css" type="text/css"'
    );
    document.insertBefore(style, document.documentElement);

    const placesToolbar = document.getElementById('placesToolbar');
    placesToolbar.setAttribute('data-before', 'View and track your downloads');
    document.getElementById('back-button')?.remove();
    document.getElementById('forward-button')?.remove();

    const closeButton = document.createXULElement('toolbarbutton');
    closeButton.id = 'closeButton';
    closeButton.setAttribute('label', 'Close');
    closeButton.addEventListener('command', () => window.close());
    placesToolbar.appendChild(closeButton);

    document.getElementById('clearDownloadsButton').setAttribute('label', 'Clear list');
}

window.addEventListener('load', function () {
    setTimeout(styleDownloads, 0);
});
