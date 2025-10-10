(function() {
  const urlbarInput = document.getElementById("urlbar-input");
  if (!urlbarInput) return;

  function updatePlaceholder() {
    if (document.documentElement.hasAttribute("privatebrowsingmode")) {
      urlbarInput.setAttribute("placeholder", "about:InPrivate");
    } else {
      urlbarInput.removeAttribute("placeholder");
    }
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "privatebrowsingmode") {
        updatePlaceholder();
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true });

  updatePlaceholder();

})();