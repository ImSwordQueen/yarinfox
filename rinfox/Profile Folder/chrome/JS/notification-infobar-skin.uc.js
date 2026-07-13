(function () {
  if (location.href !== "chrome://browser/content/browser.xhtml") return;

  const styleNotification = notification => {
    if (
      notification.localName !== "notification-message" ||
      notification.getAttribute("message-bar-type") !== "infobar"
    ) {
      return;
    }

    const applyStyle = async () => {
      await notification.updateComplete;

      const root = notification.shadowRoot;
      if (!root) return;

      if (!root.querySelector("style[data-rinfox-infobar-skin]")) {
        const style = document.createElement("style");
        style.dataset.rinfoxInfobarSkin = "";
        style.textContent = `
          .container {
            box-sizing: border-box !important;
            height: 23px !important;
            min-height: 23px !important;
            padding-block: 0 !important;
            align-items: center !important;
          }

          .content,
          .text-container,
          .text-content {
            height: 100% !important;
            padding-block: 0 !important;
            align-items: center !important;
          }

          .close {
            margin-block: 0 !important;
            align-self: center !important;
          }
        `;
        root.append(style);
      }

      const closeButton = root.querySelector("moz-button.close");
      if (!closeButton) return;

      await closeButton.updateComplete;
      const closeRoot = closeButton.shadowRoot;
      if (!closeRoot) return;

      let closeStyle = closeRoot.querySelector("style[data-rinfox-close-skin]");
      if (!closeStyle) {
        closeStyle = document.createElement("style");
        closeStyle.dataset.rinfoxCloseSkin = "";
        closeRoot.append(closeStyle);
      }
      closeStyle.textContent = `
        .button-background {
          background-image: none !important;
          background-color: transparent !important;
          border: 0 !important;
        }

        .button-background::before,
        .button-background::after {
          content: "";
          position: absolute;
          top: calc(50% - 1px);
          left: 50%;
          width: 10px;
          height: 2px;
          background: #000 !important;
        }

        .button-background::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .button-background::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      `;
    };

    if (notification.shadowRoot) {
      applyStyle();
    } else {
      customElements.whenDefined("notification-message").then(applyStyle);
    }
  };

  const init = () => {
    const toolbar = document.getElementById("notifications-toolbar");
    if (!toolbar) return;

    toolbar.querySelectorAll("notification-message").forEach(styleNotification);

    new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          styleNotification(node);
          node.querySelectorAll?.("notification-message").forEach(styleNotification);
        }
      }
    }).observe(toolbar, { childList: true, subtree: true });
  };

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }
})();
