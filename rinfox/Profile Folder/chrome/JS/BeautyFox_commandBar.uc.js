// ==UserScript==
// @name		BeautyFox - Command Bar
// @description Adds a bunch of elements such as buttons, menus, etc... related to command bar.
// @author		AngelBruni
// @loadorder   3
// ==/UserScript==

// ATTENTION: Most of this code is TERRIBLE, no worries, Geckium will bring a better one.

window.addEventListener('close', function() {
	const commandBarCollapsed = document.getElementById("commandBar").getAttribute("collapsed") === "true";
	pref('BeautyFox.option.commandBar').set.bool(!commandBarCollapsed);
});	

function createCBHomeButton() {
    try {
        const cbHomeButtonLabel = "Home";
        CustomizableUI.createWidget({
            id: 'cBHomeButton',
            defaultArea: CustomizableUI.AREA_BOOKMARKS,
            removable: true,
            label: cbHomeButtonLabel,
            tooltiptext: cbHomeButtonLabel,
            onCommand: function () { BrowserHome(event); },
            onCreated: function (button) {
                button.setAttribute('data-l10n-id', 'home_button');
                return button;
            },
        });
    }
    catch (e) { Components.utils.reportError(e); }
}

function createCBReadMailButton() {
    try {
        const cbReadMailButtonLabel = "Read mail";
        CustomizableUI.createWidget({
            id: 'cBReadMailButton',
            defaultArea: CustomizableUI.AREA_BOOKMARKS,
            removable: true,
            label: cbReadMailButtonLabel,
            tooltiptext: cbReadMailButtonLabel,
            onCommand: function () {
                _ucUtils.loadURI(window, {
                    url: 'mailto:',
                    where: "tab"
                });;
            },
            onCreated: function (button) {
                button.setAttribute('locale', 'ReadMail');
                return button;
            },
        });
    }
    catch (e) { Components.utils.reportError(e); }
}

function mailWithWindowsLive() {
    _ucUtils.loadURI(window, {
        url: 'https://outlook.live.com/mail',
        where: 'tab'
    });
}

function translatePage() {
    _ucUtils.loadURI(window, {
        url: "https://translate.google.com/translate?sl=auto&tl=en&u=" + encodeURIComponent(gBrowser.selectedBrowser.currentURI.spec),
        where: "tab"
    });
}

function findMoreAccelerators() {
    _ucUtils.loadURI(window, {
        url: 'https://addons.mozilla.org',
        where: 'tab'
    });
}

function reportUnsafeWebsite() {
    _ucUtils.loadURI(window, {
        url: 'https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site',
        where: 'tab'
    });
}

function toggleToolbar(toolbarId) {
	const toolbar = document.getElementById(toolbarId);
	setToolbarVisibility(toolbar, !!toolbar.getAttribute("inactive"), true, false);
}

const cBPageMenu = createMenu({
    id: 'cBPageMenu',
    name: 'Page',
    locale: 'Page',
    items: [
        {
            type: 'app',
            id: 'cBPage_newWindow',
            name: 'New Window',
            locale: 'NewWindow',
            image: 'chrome://browser/skin/window.svg',
            accelText: 'Ctrl+N',
            command: 'OpenBrowserWindow();',
        },
        //{
        //    type: 'app',
        //    name: 'Add site to Start Menu',
        //},
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBPage_cut',
            name: 'Cut',
            locale: 'Cut',
            image: 'chrome://browser/skin/edit-cut.svg',
            accelText: 'Ctrl+X',
            command: "goDoCommand('cmd_cut')"
        },
        {
            type: 'app',
            id: 'cBPage_copy',
            name: 'Copy',
            locale: 'Copy',
            image: 'chrome://devtools/skin/images/copy.svg',
            accelText: 'Ctrl+C',
            command: "goDoCommand('cmd_copy')"
        },
        {
            type: 'app',
            id: 'cBPage_paste',
            name: 'Paste',
            locale: 'Paste',
            image: 'chrome://browser/skin/edit-paste.svg',
            accelText: 'Ctrl+V',
            command: "goDoCommand('cmd_paste')"
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBPage_eMailWindowsLive',
            name: 'E-mail with Windows Live',
            locale: 'EMailWithindowsLive',
            command: 'mailWithWindowsLive()',
        },
        //{
        //    type: 'app',
        //    name: 'Translate with Bing',
        //},
        {
            type: 'app',
            id: 'cBPage_googleTranslate',
            name: 'Translate with Google',
            locale: 'TranslateWithGoogle',
            command: 'translatePage()',
        },
        {
            type: 'separator',
        },
        {
            type: 'subdir',
            id: 'cBPage_allAccelerators',
            name: 'All Accelerators',
            locale: 'AllAccelerators',
            items: [
                {
                    type: 'app',
                    id: 'cBPage_findMoreAccelerators',
                    name: 'Find more Accelerators',
                    locale: 'FindMoreAccelerators',
                    command: 'findMoreAccelerators();',
                },
                {
                    type: 'app',
                    id: 'cBPage_manageAccelerators',
                    name: 'Manage Accelerators...',
                    locale: 'ManageAccelerators',
                    command: 'BrowserOpenAddonsMgr();',
                }
            ],
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBPage_saveAs',
            name: 'Save as...',
            locale: 'SaveAs',
            image: 'chrome://browser/skin/save.svg',
            accelText: 'Ctrl+S',
            command: 'saveBrowser(gBrowser.selectedBrowser);',
        },
        //{
        //    type: 'app',
        //    name: 'Send page by e-mail...',
        //},
        {
            type: 'app',
            id: 'cBPage_sendLinkbyEMail',
            name: 'Send link by e-mail...',
            locale: 'SendLinkByEMail',
            image: 'chrome://browser/skin/mail.svg',
            command: 'MailIntegration.sendLinkForBrowser(gBrowser.selectedBrowser);',
        },
        //{
        //    type: 'app',
        //    name: 'Edit',
        //},
        //{
        //    type: 'separator',
        //},
        //{
        //    type: 'app',
        //    name: 'Compatibility View',
        //},
        //{
        //    type: 'app',
        //    name: 'Compatibility View settings',
        //},
        {
            type: 'separator',
        },
        {
            type: 'subdir',
            id: 'cBPage_zoom',
            name: 'Zoom',
            locale: 'Zoom',
            image: 'chrome://global/skin/icons/search-glass.svg',
            items: [
                {
                    type: 'app',
                    id: 'cBPage_zoomIn',
                    name: 'Zoom in',
                    locale: 'ZoomIn',
                    accelText: 'Ctrl +',
                    command: 'FullZoom.enlarge()',
                },
                {
                    type: 'app',
                    id: 'cBPage_zoomOut',
                    name: 'Zoom out',
                    locale: 'ZoomOut',
                    accelText: 'Ctrl -',
                    command: 'FullZoom.reduce()',
                },
                {
                    type: 'separator',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom400',
                    name: '400%',
                    command: 'FullZoom.setZoom(4)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom200',
                    name: '200%',
                    command: 'FullZoom.setZoom(2)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom150',
                    name: '150%',
                    command: 'FullZoom.setZoom(1.5)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom125',
                    name: '125%',
                    command: 'FullZoom.setZoom(1.25)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom100',
                    name: '100%',
                    accelText: 'Ctrl+0',
                    command: 'FullZoom.setZoom(1)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom075',
                    name: '75%',
                    command: 'FullZoom.setZoom(.75)',
                },
                {
                    type: 'app',
                    id: 'cBPage_setZoom050',
                    name: '50%',
                    command: 'FullZoom.setZoom(.5)',
                },
                //{
                //    type: 'separator',
                //},
                //{
                //    type: 'app',
                //    name: 'Custom...',
                //},
            ],
        },
        //{
        //    type: 'subdir',
        //    name: 'Text size',
        //    items: [],
        //},
        {
            type: 'subdir',
            id: 'cBPage_style',
            name: 'Style',
            locale: 'Style',
            items: [
                {
                    type: 'app',
                    id: 'cBPage_noStyle',
                    name: 'No style',
                    locale: 'NoStyle',
                    command: 'gPageStyleMenu.disableStyle();',
                },
                {
                    type: 'app',
                    id: 'cBPage_defaultStyle',
                    name: 'Default style',
                    locale: 'DefaultStyle',
                    command: 'gPageStyleMenu.switchStyleSheet(null);',
                },
            ],
        },
        //{
        //    type: 'subdir',
        //    name: 'Encoding',
        //    items: [],
        //},
        {
            type: 'app',
            id: 'cBPage_caretBrowsing',
            name: 'Caret browsing',
            locale: 'CaretBrowsing',
            accelText: 'F7',
            command: 'gBrowser.toggleCaretBrowsing()',
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBPage_properties',
            name: 'Properties',
            locale: 'Properties',
            command: 'BrowserPageInfo();',
        },
        {
            type: 'app',
            id: 'cBPage_viewSource',
            name: 'View source',
            locale: 'ViewSource',
            command: 'BrowserViewSource(window.gBrowser.selectedBrowser)',
        },
    ],
});
cBPageMenu.init();

const cBSafetyMenu = createMenu({
    id: 'cBSafetyMenu',
    name: 'Safety',
    locale: 'Safety',
    items: [
        {
            type: 'app',
            id: 'cBSafety_deleteBrowsingHistory',
            name: 'Delete browsing history...',
            locale: 'DeleteBrowsingHistory',
            image: 'chrome://devtools/skin/images/clear.svg',
            accelText: 'Ctrl+Shift+Del',
            command: 'Sanitizer.showUI(window);',
        },
        {
            type: 'app',
            id: 'cBSafety_inPrivateBrowsing',
            name: 'InPrivate Browsing',
            locale: 'InPrivateBrowsing',
            image: 'chrome://browser/skin/privateBrowsing.svg',
            accelText: 'Ctrl+Shift+P',
            command: 'OpenBrowserWindow({private: true});',
        },
        {
            type: 'app',
            id: 'cBSafety_trackingProtection',
            name: 'Tracking Protection...',
            locale: 'TrackingProtection',
            command: 'gProtectionsHandler.openPreferences()',
        },
        //{
        //    type: 'app',
        //    id: 'cBSafety_activeXFiltering',
        //    name: 'ActiveX Filtering',
        //},
        //{
        //    type: 'app',
        //    id: 'cBSafety_webpagePrivacyPolicy',
        //    name: 'Webpage privacy policy...',
        //},
        {
            type: 'separator',
        },
        //{
        //    type: 'app',
        //    id: 'cBSafety_securityReport',
        //    name: 'Security report',
        //},
        //{
        //    type: 'app',
        //    id: 'cBSafety_internationalWebsiteAddress',
        //    name: 'International website address',
        //},
        {
            type: 'subdir',
            id: 'cBSafety_smartScreenFilter',
            name: 'SmartScreen Filter',
            locale: 'SmartScreenFilter',
            items: [
                //{
                //    type: 'app',
                //    id: 'cBSafety_checkWebsite',
                //    name: 'Check this website',
                //},
                //{
                //    type: 'app',
                //    id: 'cBSafety_turnOnSmartScreenFilter',
                //    name: 'Turn on SmartScreen Filter...',
                //},
                {
                    type: 'app',
                    id: 'cBSafety_reportUnsafeWebsite',
                    name: 'Report unsafe website',
                    locale: 'ReportUnsafeWebsite',
                    command: 'reportUnsafeWebsite();',
                },
            ]
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBSafety_windowsUpdate',
            name: 'Windows Update',
            command: 'openWindowsUpdate()'
        },
    ],
});
cBSafetyMenu.init();

function openWindowsUpdate() { runFile("control.exe", "/name Microsoft.WindowsUpdate") };

const cBToolsMenu = createMenu({
    id: 'cBToolsMenu',
    name: 'Tools',
    locale: 'Tools',
    items: [
        {
            type: 'app',
            id: 'cBTools_diagnoseConnectionProblems',
            name: 'Diagnose connection problems...',
            locale: 'DiagnoseConnectionProblems',
            command: 'runFile("msdt.exe", "-skip TRUE -path C:\\Windows\\diagnostics\\system\\networking -ep NetworkDiagnosticsConnectivity")',
        },
        {
            type: 'app',
            id: 'cBTools_reopenLastBrowsingSession',
            name: 'Reopen last browsing session',
            locale: 'ReopenLastBrowsingSession',
            command: 'SessionStore.restoreLastSession();',
        },
        {
            type: 'separator',
        },
        //{
        //    type: 'subdir',
        //    id: 'cBTools_popUpBlocker',
        //    name: 'Pop-up Blocker',
        //    image: 'chrome://browser/skin/notification-icons/popup.svg',
        //    items: [
        //        {
        //            type: 'app',
        //            id: 'cBTools_turnOffPopUpBlocker',
        //            name: 'Turn off Pop-Up Blocker',
        //        },
        //        {
        //            type: 'app',
        //            id: 'cBTools_popUpBlockerSettings',
        //            name: 'Pop-Up Blocker settings',
        //        },
        //    ]
        //},
        {
            type: 'app',
            id: 'cBTools_viewDownloads',
            name: 'View downloads',
            locale: 'ViewDownloads',
            accelText: 'Ctrl+J',
            command: 'BrowserDownloadsUI();',
        },
        {
            type: 'app',
            id: 'cBTools_manageAddOns',
            name: 'Manage add-ons',
            locale: 'ManageAddOns',
            image: 'chrome://devtools/skin/images/debugging-addons.svg',
            command: 'BrowserOpenAddonsMgr();',
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBTools_workOffline',
            name: 'Work offline',
            locale: 'WorkOffline',
            command: 'BrowserOffline.toggleOfflineStatus();',
        },
        //{
        //    type: 'app',
        //    id: 'cBTools_compatibilityView',
        //    name: 'Compatibility View',
        //},
        //{
        //    type: 'app',
        //    id: 'cBTools_compatibilityViewSettings',
        //    name: 'Compatibility View settings',
        //},
        {
            type: 'app',
            id: 'cBTools_fullScreen',
            name: 'Full screen',
            locale: 'FullScreen',
            image: 'chrome://browser/skin/fullscreen.svg',
            accelText: 'F11',
            command: 'BrowserFullScreen();',
        },
        {
            type: 'subdir',
            id: 'cBTools_toolbars',
            name: 'Toolbars',
            locale: 'Toolbars',
            items: [
                {
                    type: 'app',
                    id: 'cBTools_menuBar',
                    name: 'Menu bar',
                    locale: 'MenuBar',
                    command: "toggleToolbar('toolbar-menubar');"
                },
                {
                    type: 'app',
                    id: 'cBTools_favoritesBar',
                    name: 'Favourites bar',
                    locale: 'FavouritesBar',
                    command: "BookmarkingUI.toggleBookmarksToolbar('shortcut');",
                },
				{
                    type: 'app',
                    id: 'cBTools_commandBar',
                    name: 'Command bar',
                    locale: 'CommandBar',
                    command: "toggleToolbar('commandBar');",
                },
                {
                    type: 'separator',
                },
                {
                    type: 'app',
                    id: 'cBTools_manageAddOns2',
                    name: 'Manage add-ons',
                    locale: 'ManageAddOns',
                    command: 'BrowserOpenAddonsMgr();',
                },
                {
                    type: 'separator',
                },
                {
                    type: 'app',
                    id: 'cBTools_customize',
                    name: 'Customize...',
                    locale: 'Customise',
                    command: 'gCustomizeMode.enter();',
                },
            ]
        },
        {
            type: 'subdir',
            id: 'cBTools_explorerBars',
            name: 'Explorer bars',
            locale: 'ExplorerBars',
            items: [
                {
                    type: 'app',
                    id: 'cBTools_favorites',
                    name: 'Favourites',
                    locale: 'Favourites',
                    command: "SidebarUI.toggle('viewBookmarksSidebar');",
                },
                {
                    type: 'app',
                    id: 'cBTools_history',
                    name: 'History',
                    locale: 'History',
                    command: "SidebarUI.toggle('viewHistorySidebar')",
                },
                /*{
                    type: 'app',
                    id: 'cBTools_syncedTabs',
                    name: 'Synced tabs',
                    command: "SidebarUI.toggle('viewTabsSidebar');",
                },*/
            ]
        },
        //{
        //    type: 'separator'
        //},
        //{
        //    type: 'app',
        //    id: 'cBTools_f12DeveloperTools',
        //    name: 'F12 developer tools',
        //    image: 'chrome://global/skin/icons/developer.svg',
        //},
        //{
        //    type: 'separator'
        //},
        //{
        //    type: 'app',
        //    id: 'cBTools_suggestedSites',
        //    name: 'Suggested Sites',
        //},
        {
            type: 'separator'
        },
        {
            type: 'app',
            id: 'cBTools_internetOptions',
            name: 'Internet options',
            locale: 'InternetOptions',
            image: 'chrome://devtools/skin/images/settings.svg',
            command: 'openInternetOptions();',
        },
    ],
});
cBToolsMenu.init();

const cBHelpMenu = createMenu({
    id: 'cBHelpMenu',
    image: 'url(chrome://global/skin/icons/help.svg)',
    name: 'Help',
    locale: 'Help',
    items: [
        {
            type: 'app',
            id: 'cBHelp_internetExplorerHelp',
            name: 'Internet Explorer Help',
            locale: 'InternetExplorerHelp',
            accelText: 'F1',
            command: "openHelpLink('firefox-help');",
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBHelp_whatsNewInBeautyFox',
            name: "What's new in BeautyFox",
            locale: "NewBeautyFox",
            special: true,
            command: "_ucUtils.loadURI(window,{url: 'chrome://userchrome/content/temppages/changelogs/ob-1.0.2.html', where: 'tab'});"
        },
        {
            type: 'separator',
            special: true
        },
        {
            type: 'app',
            id: 'cBHelp_whatsNewInIE',
            name: "What's new in Internet Explorer",
            locale: "NewIE",
            command: "openWhatsNewIE();"
        },
        {
            type: 'separator',
        },
        {
            type: 'app',
            id: 'cBHelp_aboutInternetExplorer',
            name: 'About Internet Explorer',
            locale: 'aboutIE',
            command: 'openAboutDialog();',
        },
    ],
});
cBHelpMenu.init();

function openWhatsNewIE() {
    var whatsNewURL;
    if (pref('RinFox.Appearance.IE8').tryGet.bool()) { whatsNewURL = 'https://web.archive.org/web/20110322221930id_/http://windows.microsoft.com/en-US/internet-explorer/products/ie-8/welcome'; }
    else { whatsNewURL = 'https://web.archive.org/web/20090101033733id_/http://www.microsoft.com/windows/ie/ie7/tour/fre/default.mspx'; }
    _ucUtils.loadURI(window, {
        url: whatsNewURL, 
        where: 'tab'
    })
}

// #endregion