(function() {
    const identityBoxId = 'identity-box';
    const targetClass = 'unknownIdentity';
    const markerClass = 'insecure-urlbar';

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
        if (identityBox.classList.contains(targetClass)) {
            urlbar.classList.add(markerClass);
            urlbarContainer.classList.add(markerClass);
            console.log(`[URLBarMarker] Insecure connection detected. Marker class applied.`);
        } else {
            urlbar.classList.remove(markerClass);
            urlbarContainer.classList.remove(markerClass);
            console.log(`[URLBarMarker] Secure connection. Marker class removed.`);
        }
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                setUrlBarMarker();
            }
        }
    });

    const observerConfig = { attributes: true, attributeFilter: ['class'] };

    observer.observe(identityBox, observerConfig);

    setUrlBarMarker();

})();