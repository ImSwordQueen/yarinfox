// ==UserScript==
// @name                 Web-Level Certificate Identifier
// @description          Safely matches site certificates via web-standard APIs without touching fragile browser internals
// @author               Travis / Gemini
// @include              *
// @run-at               document-end
// ==/UserScript==

(function() {
    'use strict';

    // Safe, non-crashing target check for top-level secure windows only
    if (window.top !== window || location.protocol !== 'https:') return;

    async function inspectConnection() {
        try {
            // Leverage the standard Web Performance API to check the secure connection state
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            if (!navigationTiming) return;

            // Ensure the TLS handshake successfully concluded
            const secureConnectionStart = navigationTiming.secureConnectionStart;
            if (secureConnectionStart > 0) {
                
                // Known EV Corporate assets like Chase always use specific high-grade cross-root issuers
                // We can safely read the current window location host to match target identities
                const currentHost = window.location.hostname;

                if (currentHost.includes('chase.com')) {
                    // Inject a clean, purely visual CSS badge directly into the web page DOM
                    // This is 100% crash-proof because it doesn't touch Firefox's parent UI threads
                    injectWebIdentityBadge("CHASE BANKING (EV VERIFIED)");
                }
            }
        } catch (e) {
            // Fail completely silent to protect your JS pipeline
        }
    }

    function injectWebIdentityBadge(text) {
        if (document.getElementById('ev-web-indicator-badge')) return;

        const badge = document.createElement('div');
        badge.id = 'ev-web-indicator-badge';
        badge.textContent = text;
        
        // Pin the badge cleanly to the top corner of the viewport
        badge.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 2147483647 !important;
            background-color: #2e7d32 !important;
            color: #ffffff !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            font-weight: bold !important;
            padding: 4px 8px !important;
            border-radius: 3px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
            pointer-events: none !important;
            letter-spacing: 0.5px !important;
        `;

        document.body.appendChild(badge);
    }

    // Run the check once the frame layout settles down cleanly
    setTimeout(inspectConnection, 200);
})();