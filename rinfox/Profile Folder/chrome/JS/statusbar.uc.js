window.addEventListener("load", function() {
  var statusBar = document.getElementById('addonbar');

  const newElementDiv = document.createElement('div');
  const newElementButton = document.createElement('customtoolbarbutton');

  newElementDiv.classList.add('internet-options');
  newElementDiv.setAttribute('tooltiptext', 'Double-click to see page security settings');
  newElementButton.classList.add('zoom-button');
  newElementButton.setAttribute('tooltiptext', 'Change zoom level');

  newElementDiv.addEventListener('dblclick', function() {
    BrowserPageInfo();
  });

  const securityButton = document.createElement('customtoolbarbutton');
  securityButton.classList.add('security-button');
  securityButton.setAttribute('tooltiptext', 'InPrivate Filtering');
  securityButton.style.filter = 'saturate(0)';

  securityButton.addEventListener('click', function() {
    if (securityButton.style.filter === 'none') {
      securityButton.style.filter = 'saturate(0)';
    } else {
      securityButton.style.filter = 'none';
    }
  });

  const securitySeparator = document.createElement('div');
  securitySeparator.classList.add('security-separator');

  let currentZoomLevel = 100;

  function updateButtonText() {
    newElementButton.textContent = `${currentZoomLevel}%`;
  }

  FullZoom.reduce();
  updateButtonText();

  newElementButton.addEventListener('click', function() {
    if (currentZoomLevel === 100) {
      FullZoom.enlarge();
      currentZoomLevel = 125;
    } else if (currentZoomLevel === 125) {
      FullZoom.enlarge();
      currentZoomLevel = 150;
    } else {
      FullZoom.reduce();
      FullZoom.reduce();
      currentZoomLevel = 100;
    }
    updateButtonText();
  });

  statusBar.appendChild(newElementDiv);
  statusBar.appendChild(securityButton);
  statusBar.appendChild(securitySeparator);
  statusBar.appendChild(newElementButton);

  const cornerIcon = document.createElement('div');
  cornerIcon.classList.add('corner-icon');
  statusBar.insertBefore(cornerIcon, newElementButton.nextSibling);

  for (let i = 0; i < 7; i++) {
    const separators = document.createElement('div');
    separators.classList.add(`separator-${i + 1}`);
    statusBar.insertBefore(separators, newElementDiv);
  }

  const statusText = document.createElement('div');
  statusText.classList.add('status-text');
  statusText.textContent = '';
  statusBar.insertBefore(statusText, statusBar.firstChild);

  const originalStatusPanel = document.getElementById('statuspanel-label');
  if (originalStatusPanel) {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'value') {
          statusText.textContent = originalStatusPanel.value;
          statusText.style.display = 'block';
        }
      });
    });

    observer.observe(originalStatusPanel, {
      attributes: true,
      attributeFilter: ['value']
    });

    const statusPanel = document.getElementById('statuspanel');
    let activityObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'inactive' && statusPanel.hasAttribute('inactive')) {
          statusText.style.display = 'none';
        }
      });
    });
    activityObserver.observe(statusPanel, {
      attributes: true
    });
  }

  const doneText = document.createElement('div');
  doneText.classList.add('doneText');
  doneText.textContent = 'Done';

  statusBar.appendChild(doneText);

  // Existing doneText logic, modified
  function updateDoneTextVisibility() {
    const statusPanel = document.querySelector('#statuspanel[type="defaultStatus"][previoustype="status"]');

    if (statusPanel && statusPanel.hasAttribute('inactive')) {
      doneText.style.display = 'block';
    } else {
      doneText.style.display = 'none';
    }
  }

  updateDoneTextVisibility();
  document.body.addEventListener('DOMSubtreeModified', updateDoneTextVisibility);
  
  var addonElements = Array.from(document.querySelectorAll('[id*="BAP"]'));
  
  addonElements.forEach(function(addonElement) {
    if (addonElement.parentElement === statusBar) {
      // Check if the element's extension ID is pinned to the addon bar
      var extensionID = addonElement.id.replace(/-[^-]*$/, '');
      if (isExtensionPinned(extensionID)) {
        statusBar.insertBefore(addonElement, newElementDiv);
      }
    }
  });

  function isExtensionPinned(extensionID) {
    var { AddonManager } = Components.utils.import("resource://gre/modules/AddonManager.jsm", {});
    return new Promise((resolve) => {
      AddonManager.getAllAddons(addons => {
        for (let addon of addons) {
          if (addon.id === extensionID && addon.userDisabled === false) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      });
    });
  }
});