// ==UserScript==
// @name            Native Browser Frame
// @description     Extends the native browser frame from the menubar through the status bar
// @include         main
// ==/UserScript==

function createNativeBrowserFrame() {
    const root = document.documentElement;
    const titlebar = document.getElementById("titlebar");
    const browser = document.getElementById("browser");

    if (!titlebar || !browser || document.getElementById("rinfox-native-browser-frame")) {
        return;
    }

    const frame = document.createXULElement("box");
    frame.id = "rinfox-native-browser-frame";
    root.appendChild(frame);

    function updateFrameBounds() {
        const titlebarBounds = titlebar.getBoundingClientRect();
        const browserBounds = browser.getBoundingClientRect();
        frame.style.top = `${titlebarBounds.top}px`;
        frame.style.bottom = `${Math.max(0, window.innerHeight - browserBounds.bottom)}px`;
    }

    const resizeObserver = new ResizeObserver(updateFrameBounds);
    resizeObserver.observe(titlebar);
    resizeObserver.observe(browser);
    window.addEventListener("resize", updateFrameBounds);
    window.addEventListener("unload", () => resizeObserver.disconnect(), { once: true });
    updateFrameBounds();
}
