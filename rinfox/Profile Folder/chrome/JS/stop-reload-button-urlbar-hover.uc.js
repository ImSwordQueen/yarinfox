(function() {
    window.addEventListener('load', () => {
        const urlbarBackground = document.getElementById('urlbar-background');
        const stopReloadButton = document.getElementById('stop-reload-button');

        if (urlbarBackground && stopReloadButton) {
            stopReloadButton.addEventListener('mouseover', () => {
                urlbarBackground.classList.add('urlbar-hover');
            });
            stopReloadButton.addEventListener('mouseout', () => {
                urlbarBackground.classList.remove('urlbar-hover');
            });
        }*
    }, { once: true });
})();