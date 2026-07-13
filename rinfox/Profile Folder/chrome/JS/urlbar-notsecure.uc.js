(function() {
    const identityBoxId = 'identity-box';
    const targetClass = 'notSecure';
    const markerClass = 'insecure-urlbar-4';

    const urlbarId = 'urlbar';
    const urlbarContainerId = 'urlbar-container';

    const identityBox = document.getElementById(identityBoxId);
    const urlbar = document.getElementById(urlbarId);
    const urlbarContainer = document.getElementById(urlbarContainerId);

    if (!identityBox || !urlbar || !urlbarContainer) {
        console.warn(`[URLBarMarker] Could not find one or more required elements. Script aborted.`);
        return;
    }

    const setUrlBarMarker = () => {
        // 1. Fetch Firefox 115 ESR's native URL Proxy tracking state
        const proxyState = identityBox.getAttribute('pageproxystate');

        // 2. If it's 'invalid', Firefox is loading or switching tabs. Clear visual flags and exit.
        if (proxyState === 'invalid') {
            urlbar.classList.remove(markerClass);
            urlbarContainer.classList.remove(markerClass);
            return;
        }

        // 3. If proxy state is 'valid', the page is fully processed. Now verify the class safely.
        if (identityBox.classList.contains(targetClass)) {
            urlbar.classList.add(markerClass);
            urlbarContainer.classList.add(markerClass);
            console.log(`[URLBarMarker] Verified insecure connection. Marker class applied.`);
        } else {
            urlbar.classList.remove(markerClass);
            urlbarContainer.classList.remove(markerClass);
            console.log(`[URLBarMarker] Verified secure connection. Marker class removed.`);
        }
    };

    // Explicitly watch for mutations to BOTH the 'class' and 'pageproxystate' attributes
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && 
               (mutation.attributeName === 'class' || mutation.attributeName === 'pageproxystate')) {
                setUrlBarMarker();
            }
        }
    });

    const observerConfig = { 
        attributes: true, 
        attributeFilter: ['class', 'pageproxystate'] 
    };
    
    observer.observe(identityBox, observerConfig);

    // Initial check on initialization
    setUrlBarMarker();
})();
