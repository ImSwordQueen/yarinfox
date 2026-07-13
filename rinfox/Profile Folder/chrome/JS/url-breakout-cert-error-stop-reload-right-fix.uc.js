(function() {
    const urlbarId = 'urlbar';
    const urlbarContainerId = 'urlbar-container';
    const markerClass = 'breakout-active';

    const urlbar = document.getElementById(urlbarId);
    const urlbarContainer = document.getElementById(urlbarContainerId);

    if (!urlbar || !urlbarContainer) {
        console.warn(`[BreakoutMarker] Could not find required elements. Script aborted.`);
        return;
    }

    const setBreakoutMarker = () => {
        const isBreakoutActive = urlbar.hasAttribute('breakout') && 
                                 urlbar.hasAttribute('breakout-extend');

        if (isBreakoutActive) {
            urlbarContainer.classList.add(markerClass);
            console.log(`[BreakoutMarker] Breakout state detected. Marker applied.`);
        } else {
            urlbarContainer.classList.remove(markerClass);
            console.log(`[BreakoutMarker] Normal state. Marker removed.`);
        }
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                setBreakoutMarker();
            }
        }
    });

    const observerConfig = { attributes: true }; 

    observer.observe(urlbar, observerConfig);

    setBreakoutMarker();

})();