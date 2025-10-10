(function() {
  window.addEventListener('load', () => {
    const urlbarBackground = document.getElementById('urlbar-background');
    const stopReloadButton = document.getElementById('stop-reload-button');

    if (urlbarBackground && stopReloadButton) {
      stopReloadButton.addEventListener('mouseenter', () => {
        urlbarBackground.classList.add('urlbar-hover');
      });
      stopReloadButton.addEventListener('mouseleave', () => {
        urlbarBackground.classList.remove('urlbar-hover');
      });
    }
  }, { once: true });
})();