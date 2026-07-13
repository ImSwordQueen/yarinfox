
window.addEventListener("load", function() {
  var statusBar = document.getElementById('addonbar');

  const newElementDiv = document.createElement('div');
  const newElementButton = document.createElement('customtoolbarbutton');

  newElementDiv.classList.add('internet-options');
  newElementDiv.setAttribute('tooltiptext', 'Double-click to see page security settings');
  newElementButton.classList.add('zoom-button');
  newElementButton.setAttribute('tooltiptext', 'Change zoom level');

  newElementDiv.addEventListener('dblclick', function() {
    BrowserCommands.pageInfo();
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

  function updateButtonText() {
    const currentZoomLevel = Math.round(ZoomManager.zoom * 100);
    newElementButton.textContent = `${currentZoomLevel}%`;
  }

  updateButtonText();
  window.addEventListener('FullZoomChange', updateButtonText);
  window.addEventListener('TabAttrModified', updateButtonText);
  window.addEventListener('TabSelect', updateButtonText);

  newElementButton.addEventListener('click', function() {
    const currentZoomLevel = Math.round(ZoomManager.zoom * 100);

    if (currentZoomLevel === 100) {
      FullZoom.setZoom(1.25);
    } else if (currentZoomLevel === 125) {
      FullZoom.setZoom(1.5);
    } else {
      FullZoom.setZoom(1);
    }
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

  const statusProgress = document.createElement('progress');
  statusProgress.classList.add('status-progress');
  statusProgress.max = 100;
  statusProgress.value = 0;
  const progressSeparator = statusBar.querySelector('.separator-1');
  progressSeparator.hidden = true;
  progressSeparator.appendChild(statusProgress);

  const progressListener = {
    QueryInterface: ChromeUtils.generateQI([
      'nsIWebProgressListener',
      'nsISupportsWeakReference'
    ]),

    progressTimer: null,
    hideTimer: null,

    onProgressChange(webProgress, request, currentSelf, maximumSelf, currentTotal, maximumTotal) {
      if (!webProgress.isTopLevel || maximumTotal <= 0) {
        return;
      }

      const percentage = Math.min(95, Math.round(currentTotal / maximumTotal * 100));
      if (percentage > statusProgress.value) {
        statusProgress.value = percentage;
      }
    },

    onStateChange(webProgress, request, stateFlags) {
      if (!webProgress.isTopLevel || !(stateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK)) {
        return;
      }

      const progressState = Ci.nsIWebProgressListener;
      if (stateFlags & progressState.STATE_START) {
        clearTimeout(this.hideTimer);
        clearInterval(this.progressTimer);
        statusProgress.value = 2;
        progressSeparator.hidden = false;
        this.progressTimer = setInterval(() => {
          if (statusProgress.value < 90) {
            statusProgress.value += 1;
          }
        }, 200);
      } else if (stateFlags & progressState.STATE_STOP) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
        statusProgress.value = 100;
        this.hideTimer = setTimeout(() => {
          progressSeparator.hidden = true;
          statusProgress.value = 0;
          this.hideTimer = null;
        }, 150);
      }
    },

    onLocationChange() {},
    onStatusChange() {},
    onSecurityChange() {}
  };

  gBrowser.addProgressListener(progressListener);
  window.addEventListener('unload', function() {
    clearInterval(progressListener.progressTimer);
    clearTimeout(progressListener.hideTimer);
    gBrowser.removeProgressListener(progressListener);
  }, { once: true });

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

  function updateDoneTextVisibility() {
    const statusPanel = document.querySelector('#statuspanel[type="defaultStatus"][previoustype="status"]');

    if (statusPanel && statusPanel.hasAttribute('inactive')) {
      doneText.style.display = 'block';
    } else {
      doneText.style.display = 'none';
    }
  }

  updateDoneTextVisibility();
  new MutationObserver(updateDoneTextVisibility).observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
  });

  window.addEventListener('click', function(event) {
    const unifiedExtensionsButton = event.composedPath().find(
      node => node.id === 'unified-extensions-button'
    );

    if (
      event.button !== 0 ||
      !unifiedExtensionsButton ||
      !document.getElementById('addonbar')?.contains(unifiedExtensionsButton)
    ) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    gUnifiedExtensions.togglePanel(event);
  }, true);

  window.addEventListener('popupshown', function(event) {
    if (event.target.id !== 'unified-extensions-panel') {
      return;
    }

    const unifiedExtensionsButton = document.getElementById('unified-extensions-button');
    if (document.getElementById('addonbar')?.contains(unifiedExtensionsButton)) {
      event.target.moveToAnchor(
        unifiedExtensionsButton,
        'topright bottomright',
        0,
        0,
        false
      );
    }
  }, true);
});