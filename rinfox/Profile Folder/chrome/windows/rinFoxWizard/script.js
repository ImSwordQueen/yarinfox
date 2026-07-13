var currentPage = 0; // Default to the first page

function addActivationListener(elementId, eventType, callback) {
    var element = document.getElementById(elementId);

    if (element) {
        element.addEventListener(eventType, callback);
    } else {
        console.log('The wizard control was not found: ' + elementId);
    }
}

function updateNavBackButton() {
    var navBackButton = document.getElementById('backButton');

    if (navBackButton) {
        // Disable the button if currentPage is 0, enable otherwise
        navBackButton.disabled = (currentPage === 0);
    }
}

function showPage(pageNumber) {
    var pageId = 'page' + pageNumber;
    var selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        // Hide all pages
        var pages = document.querySelectorAll('.page');
        for (var i = 0; i < pages.length; i++) {
            pages[i].style.display = 'none';
        }

        // Show the selected page
        selectedPage.style.display = 'flex';
        currentPage = pageNumber; // Update the currentPage variable
    } else {
        console.error('Page not found: ' + pageId);
    }
    
    updateNavBackButton()
}

var rinFoxIE8AppearancePref = 'RinFox.Appearance.IE8';
var chosenIEAppearance = 0;
var hideInnerBorders = 0;
var smallerInnerBordersHack = 1;

function setOptions() {
    let isRinFoxFirstRunFinished = Services.prefs.getBoolPref("RinFox.parameter.isFirstRunFinished", false);

    if (!isRinFoxFirstRunFinished) {
        Services.prefs.setBoolPref('toolkit.legacyUserProfileCustomizations.stylesheets', true);        // Enables chrome themes;
        Services.prefs.setIntPref('browser.display.windows.non_native_menus', 0);                       // Disables non-native menus;
        Services.prefs.setBoolPref('widget.non-native-theme.enabled', false);                           // Disables non-native-looking controls;
        Services.prefs.setBoolPref('browser.tabs.tabmanager.enabled', true);                            // Removes tabs dropdown;
        Services.prefs.setBoolPref('browser.theme.dark-private-windows', false);                        // Disables dark theme in Private window;
        Services.prefs.setBoolPref('nglayout.enable_drag_images', false);                               // Disables thumbnail preview when dragging tab;
        Services.prefs.setIntPref('browser.newtabpage.activity-stream.topSitesRows', 2);                // Enables two rows for the new tab page;
        Services.prefs.setBoolPref('browser.taskbar.previews.enable', true);                            // Enables taskbar tabs previews;
        Services.prefs.setBoolPref('browser.download.always_ask_before_handling_new_types', true);      // Enables legacy download dialog;
        Services.prefs.setIntPref('security.dialog_enable_delay', 0);                                   // Disables OK button delay in the legacy download dialog;
		Services.prefs.setIntPref('browser.tabs.inTitlebar', 0);										// Disable Tabs in Titlebar;
        Services.prefs.setBoolPref('nocturne.ui.oldurlbar', true);
        Services.prefs.setBoolPref('sidebar.revamp', false);

        Services.prefs.setBoolPref('RinFox.parameter.isFirstRunFinished', true)
    }
	
    Services.prefs.setBoolPref(rinFoxIE8AppearancePref, chosenIEAppearance === 1);
	
	switch (hideInnerBorders) {
	case 0:
		// Show Inner Borders
		Services.prefs.setBoolPref('RinFox.Option.HideInnerBorders', false)
		break;
	case 1:
		// Hide Inner Borders
		Services.prefs.setBoolPref('RinFox.Option.HideInnerBorders', true)
		break;
    }
	
	switch (smallerInnerBordersHack) {
	case 0:
		// Smaller Inner Borders Hack Enabled
		Services.prefs.setBoolPref('RinFox.Option.SmallerInnerBordersHack', true)
		break;
	case 1:
		// Smaller Inner Borders Hack Disabled
		Services.prefs.setBoolPref('RinFox.Option.SmallerInnerBordersHack', false)
		break;
    }
}

function checkForExpress() {
	let group = document.querySelector("radiogroup");
	let sel = group.querySelector("[selected=\"true\"]").id;

	if (sel == "expressSettings")
	{
		hideInnerBorders = 0;
		smallerInnerBordersHack = 0;
		
		showPage(5);
	}
	else if (sel == "customSettings")
	{
		showPage(3);
	}
}

function bindWizardButtons() {
    addActivationListener('wizardCloseButton', 'command', function() {
        window.close();
    });
    addActivationListener('wizardWelcomeNextButton', 'click', function() {
        showPage(1);
    });
    addActivationListener('wizardThemeIE7', 'click', function() {
        chosenIEAppearance = 0;
        showPage(2);
    });
    addActivationListener('wizardThemeIE8', 'click', function() {
        chosenIEAppearance = 1;
        showPage(2);
    });
    addActivationListener('wizardSettingsBackButton', 'click', function() {
        showPage(1);
    });
    addActivationListener('wizardSettingsNextButton', 'click', function() {
        checkForExpress();
    });
    addActivationListener('wizardShowInnerBordersButton', 'click', function() {
        hideInnerBorders = 0;
        showPage(4);
    });
    addActivationListener('wizardHideInnerBordersButton', 'click', function() {
        hideInnerBorders = 1;
        showPage(4);
    });
    addActivationListener('wizardEnableSmallerInnerBordersButton', 'click', function() {
        smallerInnerBordersHack = 0;
        showPage(5);
    });
    addActivationListener('wizardDisableSmallerInnerBordersButton', 'click', function() {
        smallerInnerBordersHack = 1;
        showPage(5);
    });
    addActivationListener('wizardFinishBackButton', 'click', function() {
        showPage(2);
    });
    addActivationListener('restartNow', 'click', function() {
        setOptions();
        
        _ucUtils.restart(true);
    });
    addActivationListener('restartLater', 'click', function() {
        setOptions();
        
        window.close();
    });
}

bindWizardButtons();
showPage(currentPage);
updateNavBackButton();