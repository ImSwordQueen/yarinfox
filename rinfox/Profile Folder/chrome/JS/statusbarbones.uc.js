var appversion = parseInt(Services.appinfo.version);

var compact_buttons = false;

var AddAddonbar = {
  init: function() {
    if (document.location.href !== 'chrome://browser/content/browser.xhtml') {
      return;
    }

    try {
      if (gBrowser.selectedBrowser.getAttribute('blank')) {
        gBrowser.selectedBrowser.removeAttribute('blank');
      }
    } catch (e) {}

    try {
      Services.prefs.getDefaultBranch('browser.addonbar.').setBoolPref('enabled', true);
    } catch (e) {}

    var addonbar_label = 'Status Bar';
    var compact_buttons_code = '';

    if (compact_buttons) {
      compact_buttons_code = `
        #addonbar toolbarbutton .toolbarbutton-icon {
          padding: 0 !important;
          width: 16px !important;
          height: 16px !important;
        }
        #addonbar .toolbarbutton-badge-stack {
          padding: 0 !important;
          margin: 0 !important;
          width: 16px !important;
          min-width: 16px !important;
          height: 16px !important;
          min-height: 16px !important;
        }
        #addonbar toolbarbutton .toolbarbutton-badge {
          margin-top: 0px !important;
          font-size: 5pt !important;
          min-width: unset !important;
          min-height: unset !important;
          margin-inline-start: 0px !important;
          margin-inline-end: 0px !important;
        }
        #addonbar .toolbaritem-combined-buttons {
          margin-inline: 0px !important;
        }
        #addonbar toolbarbutton {
          padding: 0 !important;
        }
      `;
    }

    // style sheet
    Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).loadAndRegisterSheet(
      Services.io.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(`
        ` + compact_buttons_code + `
      `), null, null),
      Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
    );

    // toolbar
    try {
      if (document.getElementById('addonbar') == null) {
        var tb_addonbar = document.createXULElement('toolbar');
        tb_addonbar.setAttribute('id', 'addonbar');
        tb_addonbar.setAttribute('collapsed', 'false');
        tb_addonbar.setAttribute('toolbarname', addonbar_label);
        tb_addonbar.setAttribute('customizable', 'true');
        tb_addonbar.setAttribute('mode', 'icons');
        tb_addonbar.setAttribute('iconsize', 'small');
        tb_addonbar.setAttribute('context', 'toolbar-context-menu');
        tb_addonbar.setAttribute('lockiconsize', 'true');
        tb_addonbar.setAttribute('class', 'toolbar-primary chromeclass-toolbar browser-toolbar customization-target');

        document.getElementById('browser').appendChild(tb_addonbar);

        CustomizableUI.registerArea('addonbar', {
          type: CustomizableUI.TYPE_TOOLBAR,
          defaultPlacements: []
        });
        CustomizableUI.registerToolbarNode(tb_addonbar);

        const placementsPref = 'browser.addonbar.placements';

        let savedPlacements;
        try {
          savedPlacements = JSON.parse(Services.prefs.getStringPref(placementsPref, '[]'));
        } catch (e) {
          savedPlacements = [];
        }

        savedPlacements.forEach((widgetId, position) => {
          CustomizableUI.addWidgetToArea(widgetId, 'addonbar', position);
        });

        function updateSavedPlacement(widgetId, position) {
          savedPlacements = savedPlacements.filter(id => id !== widgetId);
          savedPlacements.splice(position, 0, widgetId);
          Services.prefs.setStringPref(placementsPref, JSON.stringify(savedPlacements));
        }

        CustomizableUI.addListener({
          onWidgetAdded(widgetId, area, position) {
            if (area === 'addonbar') {
              updateSavedPlacement(widgetId, position);
            }
          },
          onWidgetMoved(widgetId, area, oldPosition, newPosition) {
            if (area === 'addonbar') {
              updateSavedPlacement(widgetId, newPosition);
            }
          },
          onWidgetRemoved(widgetId, area) {
            if (area === 'addonbar') {
              savedPlacements = savedPlacements.filter(id => id !== widgetId);
              Services.prefs.setStringPref(placementsPref, JSON.stringify(savedPlacements));
            }
          }
        });


        gNavToolbox.addEventListener('beforecustomization', function() {
          var browser = document.getElementById('browser');
          browser.parentNode.insertBefore(tb_addonbar, browser.nextSibling);
          tb_addonbar.style.setProperty('position', 'relative', 'important');
          tb_addonbar.style.setProperty('inset', 'auto', 'important');
          tb_addonbar.style.setProperty('z-index', 'auto', 'important');
          tb_addonbar.style.setProperty('transform', 'none', 'important');
        });

        gNavToolbox.addEventListener('aftercustomization', function() {
          document.getElementById('browser').appendChild(tb_addonbar);
          tb_addonbar.style.removeProperty('position');
          tb_addonbar.style.removeProperty('inset');
          tb_addonbar.style.removeProperty('z-index');
          tb_addonbar.style.removeProperty('transform');
        });

        try {
          setToolbarVisibility(document.getElementById('addonbar'), Services.prefs.getBranch('browser.addonbar.').getBoolPref('enabled'));
        } catch (e) {}
      }
    } catch (e) {}
  }
}

// initialization delay workaround
document.addEventListener('DOMContentLoaded', AddAddonbar.init, false);
