let navBar = document.getElementById("nav-bar");
let backButton = document.getElementById("back-button");
let forwardButton = document.getElementById("forward-button");
let observer = new MutationObserver(disableHistoryButton);

if (backButton) observer.observe(backButton, { attributes: true });
if (forwardButton) observer.observe(forwardButton, { attributes: true });

function disableHistoryButton() {
	const historyButton = document.getElementById("history-panelmenu");
	if (!historyButton || !backButton || !forwardButton) return;

	if (backButton.hasAttribute("disabled") && forwardButton.hasAttribute("disabled")) {
		historyButton.setAttribute("disabled", "true");
	} else {
		historyButton.removeAttribute("disabled");
	}
}