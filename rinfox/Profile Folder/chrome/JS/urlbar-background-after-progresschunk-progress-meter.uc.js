(function() {
  if (location.href !== "chrome://browser/content/browser.xhtml") return;

  const enabledPref = "RinFox.Option.UrlbarProgressBar";
  Services.prefs.getDefaultBranch("").setBoolPref(enabledPref, false);
  if (!Services.prefs.getBoolPref(enabledPref)) return;

  const UrlbarProgressEngine = {
    QueryInterface: ChromeUtils.generateQI([
      "nsIWebProgressListener",
      "nsISupportsWeakReference"
    ]),

    currentPercentage: 0,
    fakeProgressTimer: null,

    init: function() {
      window.gBrowser.addProgressListener(this);
    },

    updateProgress: function(aWebProgress, percentage) {
      if (!aWebProgress?.isTopLevel) return;

      const bgElement = document.getElementById("urlbar-background");
      if (!bgElement) return;

      this.currentPercentage = percentage;
      
      if (percentage === 0) {
        bgElement.style.setProperty("--urlbar-progress-width", "0px");
      } else {
        let ratio = percentage / 100;
        bgElement.style.setProperty("--urlbar-progress-width", `calc(${percentage}% + ${Math.round(ratio * 4)}px)`);
      }
    },

    onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
      if (!aWebProgress?.isTopLevel) return;

      if (aMaxTotalProgress > 0) {
        let realPercentage = Math.round((aCurTotalProgress / aMaxTotalProgress) * 100);
        
        if (realPercentage > this.currentPercentage) {
          realPercentage = Math.max(0, Math.min(98, realPercentage));
          this.updateProgress(aWebProgress, realPercentage);
        }
      }
    },

    onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
      if (!aWebProgress?.isTopLevel) return;

      const wpl = Ci.nsIWebProgressListener;
      const bgElement = document.getElementById("urlbar-background");

      if (aStateFlags & wpl.STATE_START) {
        clearInterval(this.fakeProgressTimer);
        if (bgElement) bgElement.removeAttribute("progress-done");
        
        this.updateProgress(aWebProgress, 10);
        this.fakeProgressTimer = setInterval(() => {
          if (this.currentPercentage < 40) {
            this.updateProgress(aWebProgress, this.currentPercentage + 3);
          } else {
            clearInterval(this.fakeProgressTimer);
          }
        }, 100);
      }

      if (aStateFlags & wpl.STATE_STOP) {
        clearInterval(this.fakeProgressTimer);
        
        // 1. Snap to full 100% width instantly
        this.updateProgress(aWebProgress, 100);
        
        // 2. Wait briefly so the user sees it hit the edge, then start the fade out
        setTimeout(() => {
          if (bgElement) bgElement.setAttribute("progress-done", "true");
          
          // 3. Keep the width at 100% until the 300ms CSS fade transition completes
          setTimeout(() => {
            this.updateProgress(aWebProgress, 0);
            if (bgElement) bgElement.removeAttribute("progress-done");
          }, 400); // 400ms gives a safe buffer for the 300ms fade
        }, 150);
      }
    },

    onLocationChange: function() {},
    onStatusChange: function() {},
    onSecurityChange: function() {}
  };

  if (window.gBrowser && window.gBrowser.Init) {
    UrlbarProgressEngine.init();
  } else {
    window.addEventListener("DOMContentLoaded", () => UrlbarProgressEngine.init(), { once: true });
  }
})();