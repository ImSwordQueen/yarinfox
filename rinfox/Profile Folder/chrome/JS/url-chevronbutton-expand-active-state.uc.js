(function() {
  window.addEventListener('load', () => {
    const urlbarInput = document.getElementById('urlbar-input');
    const urlbarInputBox = document.querySelector('.urlbar-input-box');

    if (urlbarInput && urlbarInputBox) {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
            if (urlbarInput.getAttribute('aria-expanded') === 'true') {
              urlbarInputBox.classList.add('expanded');
            } else {
              urlbarInputBox.classList.remove('expanded');
            }
          }
        }
      });
      observer.observe(urlbarInput, { attributes: true });
    }
  }, { once: true });
})();