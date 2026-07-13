function checkSmallBorderHackStatus() {
    try {
        return Services.prefs.getBoolPref("RinFox.Option.SmallerInnerBordersHack");
    } catch (error) {
        return false;
    }
}

const isSmallBorderBool = checkSmallBorderHackStatus();

function applySmallBorderHack() {
	if (!isSmallBorderBool) {
		return;
	}

	const root = document.documentElement;

	function updateChromeMargin() {
		if (root.getAttribute('sizemode') === 'maximized') {
			root.removeAttribute('chromemargin');
		} else {
			root.setAttribute('chromemargin', '2,2,2,2');
		}
	}

	updateChromeMargin();
	window.addEventListener('sizemodechange', updateChromeMargin);
}