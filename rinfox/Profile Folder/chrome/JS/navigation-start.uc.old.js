// ==UserScript==
// @name           Page Load Completion Sound
// @description    Plays a short chime every time a new web page finishes loading in the browser.
// @include        chrome://browser/content/browser.xhtml
// @compatibility  Firefox 115 ESR (and modern Firefox versions supporting userChrome.js)
// @author         Gemini
// ==/UserScript==

(function() {
    // --- Configuration ---
    // A Base64 encoded WAV audio URI (a short, low-volume chime).
    // This ensures the script is self-contained and doesn't rely on external files.
    const CHIME_WAV_BASE64 = 'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAACggJCgsNCw0NDQsJCggFBAQGCAkKCgsNCwwLCgkIBAQ='
    const VOLUME = 0.25; // Set volume (0.0 to 1.0)

    // --- Core Functionality ---

    /**
     * Plays the audio chime.
     */
    function playChime() {
        const audio = new Audio(CHIME_WAV_BASE64);
        audio.volume = VOLUME;

        // Using .catch() to prevent unhandled promise rejection if playback fails
        // (e.g., user interaction required, although less common in chrome environment)
        audio.play().catch(e => {
            // console.error("Could not play page load chime:", e.message);
        });
    }

    /**
     * The main event handler for when a content document finishes loading.
     * @param {Event} event The 'load' event fired on the content window.
     */
    function handlePageLoad(event) {
        const doc = event.target;
        
        // 1. Ensure the event is from the top-level document, not an iframe or sub-resource.
        if (doc.defaultView.top !== doc.defaultView) {
            return;
        }

        const url = doc.location.href;

        // 2. Ignore internal Firefox pages (about:*, chrome:*)
        if (url.startsWith("about:") || url.startsWith("chrome:") || url === "data:text/html,chromecallback") {
            return;
        }

        // 3. Run the sound function
        console.log("Page finished loading. Playing chime for:", url);
        playChime();
    }
    
    /**
     * Attaches the load listener to the specified browser element.
     * This is crucial because listeners are attached to the actual content area.
     * @param {XULElement} browser The XUL browser element (gBrowser.selectedBrowser).
     */
    function attachLoadListener(browser) {
        // Use true for useCapture to catch the event early
        browser.addEventListener("load", handlePageLoad, true);
    }
    
    /**
     * Removes the load listener from the specified browser element.
     * @param {XULElement} browser 
     */
    function removeLoadListener(browser) {
        browser.removeEventListener("load", handlePageLoad, true);
    }

    // --- Initialization & Event Binding ---

    function initPageLoadSoundScript() {
        // Check if the gBrowser object (global browser container) is available
        if (typeof gBrowser === 'undefined') {
            console.error("gBrowser object not found. uc.js environment is not fully ready.");
            return;
        }
        
        // 1. Initial setup: attach the listener to the currently selected tab/browser
        // This ensures the sound works on the first page load after Firefox starts.
        attachLoadListener(gBrowser.selectedBrowser);
        
        // 2. Setup listeners for when a tab is added or selected.
        // The 'load' event handles navigation within a single tab, 
        // but we need to ensure the listener is always active on the selected content.
        
        // On new tab being selected, ensure the listener is attached to the new content area
        gBrowser.tabContainer.addEventListener("TabSelect", (event) => {
             // We attach the listener directly to the new selected browser element.
             // (It's safe to re-attach/attach, as the load event handles the rest)
             attachLoadListener(gBrowser.selectedBrowser);
        });

        // Cleanup: Important for proper resource management if tabs close or are rearranged
        gBrowser.tabContainer.addEventListener("TabClose", (event) => {
            const browser = event.target.linkedBrowser;
            if (browser) {
                removeLoadListener(browser);
            }
        });

        console.log("Page Load Sound script initialized successfully.");
    }

    // Wait until the main browser window (chrome) has fully loaded before initializing
    // the script to ensure all necessary global objects (like gBrowser) are present.
    window.addEventListener("DOMContentLoaded", initPageLoadSoundScript, { once: true });

})();